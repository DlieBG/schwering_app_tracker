from pymongo import MongoClient
import azure.functions as func
from datetime import datetime
import json, os, base64


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
                'type': 'iotracker',
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

    decoded_payload = body.get('decoded', {}).get('payload')

    if decoded_payload:
        position = None
        environment = None

        if decoded_payload.get('gps'):
            position = {
                'lat': decoded_payload['gps']['latitude'],
                'lon': decoded_payload['gps']['longitude']
            }

        if decoded_payload.get('temperature'):
            environment = {
                'temperature': decoded_payload['temperature']
            }

        points_collection.insert_one(
            document={
                'device': body['id'],
                'type': 'iotracker',
                'timestamp': datetime.now(),
                'battery_level': decoded_payload['batteryLevel'],
                'position': position,
                'environment': environment,
                '__full_payload': decoded_payload
            }
        )
        
    return func.HttpResponse(
        status_code=200
    )
