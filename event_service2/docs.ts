export const eventDocs = {
    description: 'Event service',
    definitions: {
        event: {
            type: 'object',
            required: ['organization', 'start_timestamp', 'end_timestamp'],
            properties: {
                organization: {
                    type: 'string',
                    description: 'organization'
                },
                title: {
                    type: 'string',
                    description: 'title'
                },
                url: {
                    type: 'string',
                    description: 'url'
                },
                description: {
                    type: 'string',
                    description: 'description'
                },
                address: {
                    type: 'string',
                    description: 'address'
                },
                price: {
                    type: 'integer',
                    description: 'price'
                },
                event_time: {
                    type: 'object',
                    $ref: '#/definitions/event_time'
                }
            }
        },
        events: {
            type: 'array',
            items: {
                type: 'object',
                $ref: '#/definitions/event'
            }
        },
        events_list: {
            type: 'array',
            items: {$ref: '#/definitions/events'}
        },
        event_time: {
            type: 'object',
            properties: {
                start_timestamp: {
                    type: 'string',
                    format: 'date-time',
                    description: 'event start time'
                },
                end_timestamp: {
                    type: 'string',
                    format: 'date-time',
                    description: 'event end time'
                }
            }
        }
    },
    operations: {
        find: {
            parameters: [
                {
                    description: 'start_timestamp',
                    in: 'query',
                    name: 'start_timestamp',
                    type: 'string',
                    format: 'date-time'
                },
                {
                    description: 'end_timestamp',
                    in: 'query',
                    name: 'end_timestamp',
                    type: 'string',
                    format: 'date-time'
                },
                {
                    description: 'organization',
                    in: 'query',
                    name: 'organization',
                    type: 'string'
                },
                {
                    description: 'address used for radius search (address + miles should be used together)',
                    in: 'query',
                    name: 'address',
                    type: 'string'
                },
                {
                    description: 'miles used for radius search (address + miles should be used together)',
                    in: 'query',
                    name: 'miles',
                    type: 'string'
                },
                {
                    description: 'neighborhood',
                    in: 'query',
                    name: 'neighborhood',
                    type: 'string'
                },
                {
                    description: 'limit',
                    in: 'query',
                    name: 'limit',
                    type: 'string'
                },
                {
                    description: 'offset',
                    in: 'query',
                    name: 'offset',
                    type: 'string'
                },
            ]
        }
    }
};
export const geocodeDocs = {
    description: 'Geocoding service',
    definitions: {
        geocode: {
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                    description: 'id'
                },
                address: {
                    type: 'string',
                    description: 'address'
                },
                lat: {
                    type: 'string',
                    description: 'latitude'
                },
                lon: {
                    type: 'string',
                    description: 'longitude'
                },
                neighborhood: {
                    type: 'string',
                    description: 'neighborhood'
                },
                expire_at: {
                    type: 'string',
                    format: 'date-time',
                    description: 'when to auto-expire the record'
                }
            }
        },
        geocode_list: {
            $ref: '#/definitions/geocode'
        }
    },
    operations: {
        find: {
            parameters: [
                {
                    description: 'Address',
                    in: 'query',
                    name: 'address',
                    type: 'string'
                },
                {
                    description: 'Neighborhood',
                    in: 'query',
                    name: 'neighborhood',
                    type: 'string'
                }
            ]
        }
    }
};
export const neighborhoodDocs = {
    description: 'Return all available neighborhoods',
    definitions: {
        neighborhood: {
            'type': 'object'
        },
        neighborhoods_list: {
            type: 'array',
            items: { $ref: '#/definitions/neighborhood' }
        },
    },
    operations: {
        find: {
            parameters: []
        }
    }
};