# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html
from event_processor.models.event import EventManager, Event, EventLoader
from event_processor.util.object_hash import ObjectHash
from threading import Lock
from event_processor.config import config
from event_processor.util.data_utils import DataUtils
from event_processor.util.time_utils import TimeUtils
from event_processor.util.http_utils import HttpUtils
from scrapy.exceptions import DropItem
from datetime import datetime
import json

class EventTransformPipeline:
    """??? EventTransformPipeline: """
    def __init__(self):
        self.time_utils = TimeUtils()

    def process_item(self, item, spider):
        item['organization'] = spider.organization
        if 'event_time' in item:
            item['event_time']['date_format'] = spider.date_format
        loader = EventLoader(**item)
        # see if there is a custom filter for the item
        if not spider.item_filter(item):
            raise DropItem('Custom item filter did not allow this event')
        if 'event_time' in loader.item:
            time = loader.item['event_time']
            if self.time_utils.time_range_is_between(time['start_timestamp'], time['end_timestamp'], spider.start_timestamp, spider.end_timestamp):
                return loader.item
            else:
                raise DropItem('Event is not in the configured timeframe')
        else:
            return loader.item
            
class GeocodePipeline:
    """Get the Geocodes from the parsed address, if an address was found."""
    def __init__(self):
        self.session = HttpUtils.get_session()
    def process_item(self, item, spider):
        if 'address' in item:
            try:
                params = {
                    'address': item['address'], 
                    'lat': item['lat'] if 'lat' in item else None, 
                    'lon': item['lon'] if 'lon' in item else None
                }
                geocode = self.session.get(config.get_geocode, params=params)
                geocode_json = geocode.json()
                
                item['geocode_id'] = geocode_json['id']
                if geocode_json['lat'] == None:
                    spider.logger.warning(f'No geocode response for address {item["address"]}')
            except Exception as e:
                spider.logger.warning(f'Exception while getting geocode for address {item["address"]}: {e}')
        return item

class EventBuildPipeline:
    """??? EventBuildPipeline."""
    def process_item(self, item, spider):
        """Given an item and a spider, update the item based on its url"""
        spider.event_manager.update(item['url'], item)
        return item

class EventSavePipeline:
    def __init__(self):
        self.session = HttpUtils.get_session()

    def close_spider(self, spider):
        if len(spider.event_manager.events) == 0:
            spider.logger.info(f'No data returned for ' + spider.base_url)
        else:
            self.save_events(spider)
        if config.run_scheduler:
            spider.notify_spider_complete()

    def save_events(self, spider):
        """??? Save the given events found by a spider to the database."""
        event_list = spider.event_manager.to_dicts()
        new_hash = ObjectHash.create_hash(event_list)
        spider.logger.info(f'Found {len(event_list)} events for {event_list[0]["organization"]}.')
        if new_hash == ObjectHash.get(spider.identifier):
            spider.logger.info(f'Nothing to update.')
            return
        ObjectHash.set(spider.identifier, new_hash)
        if spider.is_errored:
            spider.logger.info('Errors occurred during processing so events will not be saved')
        else:
            kwargs = {'events': event_list}
            authorization = None
            if spider.token != None:
                authorization = f'Bearer {spider.token}'
            response = self.session.post(config.put_events, json={'events': event_list}, headers={'Authorization': authorization})
            if not response.ok:
                raise Exception(response.text)
            else:
                spider.logger.info(f'Saved {len(event_list)} events for {event_list[0]["organization"]}')