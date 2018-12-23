const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const errors = require('@feathersjs/errors');
const MongoClient = require('mongodb').MongoClient;
const service = require('feathers-mongodb');
const _ = require('lodash');
const axios = require('axios');

const port = 5000;
const timeout = 1000;
const retries = 20;

(async () => {
    let client = new MongoClient('mongodb://clipboard_db:27017/clipboard', {
        useNewUrlParser: true,
    });
    let currentTries = 0;
    async function connect() {
        try {
            await client.connect();
            setup(client);
        }
        catch (error) {
            if (error.name === 'MongoNetworkError' && currentTries < retries) {
                currentTries++;
                console.log('DB connection attempt: ' + currentTries);
                setTimeout(connect, timeout);
            }
            else {
                console.log(error);
            }
        }
    }
    connect();
})();

function setup(client) {
    const app = express(feathers());

    // Turn on JSON body parsing for REST services
    app.use(express.json({limit: '50mb'}))
    // Turn on URL-encoded body parsing for REST services
    app.use(express.urlencoded({ extended: true }));
    // Set up REST transport using Express
    app.configure(express.rest());

    let model = client.db('clipboard').collection('event');
    model.ensureIndex({'start_timestamp': 1, 'end_timestamp': 1, 'organization': 1}, function(errorMsg, indexName) {
        if (!indexName) {
            throw errors.GeneralError(errorMsg);
        }
    });

    app.use('/status', {
        async find(params) {
            return 'available'
        }
    });

    app.use('/geocode', {
        async find(params) {
            let base_url = 'https://nominatim.openstreetmap.org/search';
            let response = await axios.get(`${base_url}?q=${params.query.address}&format=json`);
            return response.data;
        }
    })

    app.use('/events', service({
        Model: model,
        paginate: {
            default: 25,
            max: 100
        }
    }));

    app.service('events').hooks(eventHooks);

    const server = app.listen(port);

    server.on('listening', () => 
        console.log(`Event service started at http://localhost:${port}`));

    // Set up an error handler that gives us nicer errors
    // This only works at the bottom of the setup logic for some reason
    app.use(express.errorHandler());
}

function timestampToDate(timestamp) {
    return new Date(timestamp * 1000);
}
function date_from_timestamp(timestamp) {
    return timestampToDate(timestamp).toLocaleDateString();
}

function time_from_timestamp(timestamp) {
    return timestampToDate(timestamp).toLocaleTimeString();
}

function transformResult(mongo_result) {
    start_timestamp = mongo_result.start_timestamp;
    end_timestamp = mongo_result.end_timestamp;
    id = mongo_result._id.toString();

    delete mongo_result.start_timestamp;
    delete mongo_result.end_timestamp;
    delete mongo_result._id;
    
    Object.assign(mongo_result, {
        start_time: time_from_timestamp(start_timestamp),
        start_date: date_from_timestamp(start_timestamp),
        end_time: time_from_timestamp(end_timestamp),
        end_date: date_from_timestamp(end_timestamp),
        id: id
    })
    
    return mongo_result;
}

const eventHooks = {
    before: {
        async find(context) {
            let query = context.params.query;
            
            // Yo dawg, we heard you like json so we put json in your query language so you can query with json while you query for json
            var search_fields = [
                { name: 'start_timestamp', func: '$gte', val: parseInt(query.start_timestamp) },
                { name: 'end_timestamp', func: '$lte', val: parseInt(query.end_timestamp) },
                { name:'organization', func: '$eq', val: query.organization }
            ]
            
            let filters = search_fields
            .filter(param => !Number.isNaN(param.val) && param.val !== undefined && param.val !== null)
            .map(param => ({
                [param.name]: {
                    [param.func]: param.val
                }
            }));
            // Remove old query parameters as they will be replaced with the entire mongo query
            for (val of search_fields) {
                delete query[val.name];
            }
            
            if (filters.length > 0) {
                let and_clause = {'$and': filters};
                Object.assign(context.params.query, and_clause);
            }
            return context;
        },

        async create(context) {
            let invalid = context.data.filter(data => !(data.organization && data.start_timestamp && data.end_timestamp));
            if (invalid.length > 0) {
                throw new errors.BadRequest('Invalid events', invalid);
            }
            let organizations = _(context.data)
                .groupBy(d => d.organization)
                .map((value, key) => key)
                .value();
            
            
            await this.remove(null, {'query': {'organization': {'$in': organizations}}});
            return context;
        }
    },
    after: {
        async find(context) {
            context.result.data = context.result.data.map(mongo_result => transformResult(mongo_result));
            return context;
        }
    }
}