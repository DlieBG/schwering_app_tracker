from dotenv import load_dotenv, find_dotenv
from pymongo import MongoClient
from datetime import datetime
from body import PayloadBody
import os

load_dotenv(find_dotenv())

mongo = MongoClient(os.getenv('MONGO_URI')).get_database('schwering_app_tracker')

mongo.get_collection('devices').create_index('id', unique=True)
mongo.get_collection('points').create_index('device')

def update_device(payload: PayloadBody):
    mongo.get_collection('devices').update_one(
        filter={
            'id': payload.id
        },
        update={
            '$set': {
                'id': payload.id,
                'name': payload.name,
                'type': 'dragino',
                'downlink_url': payload.downlink_url,
                'last_seen': datetime.now(),
                'last_rssi': payload.hotspots[0].rssi,
                'last_hotspot': {
                    'id': payload.hotspots[0].id,
                    'name': payload.hotspots[0].name,
                    'lat': payload.hotspots[0].lat,
                    'lon': payload.hotspots[0].long
                }
            },
            '$setOnInsert': {
                'display_name': payload.name
            }
        },
        upsert=True
    )

def insert_point(payload: PayloadBody, type: str, point: dict):
    point['device'] = payload.id
    point['type'] = type
    point['timestamp'] = datetime.now()
    point['__raw_payload'] = payload.payload

    mongo.get_collection('points').insert_one(
        document=point
    )
