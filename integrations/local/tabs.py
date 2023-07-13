from fastapi import APIRouter, Body
from body import PayloadBody
import db, base64, struct

router = APIRouter(
    prefix='/tabs'
)

def decode_packet(packet_b64):
    packet_bytes = base64.b64decode(packet_b64)

    assert len(packet_bytes) == 11, "Invalid packet length"

    status, battery, temp, lat, long = struct.unpack('<B B B I I', packet_bytes)

    button_trigger = bool(status & 0b1)
    moving_mode = bool((status >> 1) & 0b1)
    gnss_fix = not bool((status >> 3) & 0b1)
    gnss_error = bool((status >> 4) & 0b1)

    battery_voltage = (battery & 0b1111)
    if battery_voltage != 0:
        battery_voltage = (25 + battery_voltage) / 10.

    temperature = temp & 0b1111111
    temperature -= 32

    latitude = lat / 1_000_000
    longitude = long & 0x1fffffff
    longitude = longitude / 1_000_000 if longitude < 0x10000000 else (longitude - 0x20000000) / 1_000_000
    pos_accuracy = 2**((long >> 29) & 0b111) + 2

    return {
        'trigger': {
            'movement': moving_mode,
            'button': button_trigger
        },
        'position': {
            'lat': latitude,
            'lon': longitude,
            'accuracy': pos_accuracy,
            'gnss_fix': gnss_fix,
            'gnss_error': gnss_error
        },
        'environment': {
            'temperature': temperature,
            'battery_voltage': battery_voltage
        }
    }

@router.post('/')
async def upstream(payload = Body()):
    print(payload)
    db.update_device(payload)
    db.insert_point(payload, 'tabs', decode_packet(payload.payload))
