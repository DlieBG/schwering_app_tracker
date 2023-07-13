from pymongo import MongoClient
import azure.functions as func
from datetime import datetime
import os


def main(req: func.HttpRequest) -> func.HttpResponse:
    devices_collection = MongoClient(os.getenv('MONGO_URI', 'mongodb://127.0.0.1:27017')).get_database('schwering_app_tracker').get_collection('devices')
    points_collection = MongoClient(os.getenv('MONGO_URI', 'mongodb://127.0.0.1:27017')).get_database('schwering_app_tracker').get_collection('points')

    devices_collection.create_index('id', unique=True)
    points_collection.create_index('device')

    body = req.get_json()

    devices_collection.update_one(
        filter={
            'id': body['id']
        },
        update={
            '$set': {
                'id': body['id'],
                'name': body['name'],
                'type': 'dragino',
                'downlink_url': body['downlink_url'],
                'last_seen': datetime.now(),
                'last_rssi': body['hotspots'][0]['rssi'],
                'last_hotspot': {
                    'id': body['hotspots'][0]['id'],
                    'name': body['hotspots'][0]['name'],
                    'lat': body['hotspots'][0]['lat'],
                    'lon': body['hotspots'][0]['long']
                }
            },
            '$setOnInsert': {
                'display_name': body['name']
            }
        },
        upsert=True
    )

    points_collection.insert_one(
        document={
            'device': body['id'],
            'type': 'dragino',
            'timestamp': datetime.now(),
            '__raw_body': body
        }
    )
        
    return func.HttpResponse(
        status_code=200
    )
