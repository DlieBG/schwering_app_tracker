from pymongo import MongoClient
import azure.functions as func
from datetime import datetime
import json, os, base64


def main(req: func.HttpRequest) -> func.HttpResponse:
    clients_collection = MongoClient(os.getenv('MONGO_URI', 'mongodb://127.0.0.1:27017')).get_database('schwering_app_tracker').get_collection('clients')
    points_collection = MongoClient(os.getenv('MONGO_URI', 'mongodb://127.0.0.1:27017')).get_database('schwering_app_tracker').get_collection('points')

    body = req.get_json()

    clients_collection.update_one(
        filter={
            'id': body['id']
        },
        update={
            '$set': {
                'id': body['id'],
                'name': body['name'],
                'type': 'heltec',
                'downlink_url': body['downlink_url'],
                'last_seen': datetime.now()
            }
        },
        upsert=True
    )

    if(body['payload'] != 'aQ=='):
        decoded_payload = base64.b64decode(body['payload'])

        lat = (decoded_payload[3] << 24) | (decoded_payload[2] << 16) | (decoded_payload[1] << 8) | decoded_payload[0]
        lon = (decoded_payload[7] << 24) | (decoded_payload[6] << 16) | (decoded_payload[5] << 8) | decoded_payload[4]
        speed = (decoded_payload[11] << 24) | (decoded_payload[10] << 16) | (decoded_payload[9] << 8) | decoded_payload[8]
        
        points_collection.insert_one(
            document={
                'client': body['id'],
                'type': 'heltec',
                'timestamp': datetime.now(),
                'position': {
                    'lat': lat / 1000000,
                    'lon': lon / 1000000,
                    'speed': speed / 185.2 
                }
            }
        )
        
    return func.HttpResponse(
        status_code=200
    )
