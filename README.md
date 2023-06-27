# schwering_app_tracker
LoRaWAN GPS tracker module for schwering_app

# Database
## Heltec
Device
```json
{
    id: string,
    name: string,
    type: 'heltec',
    downlink_url: string,
    last_seen: date,
    last_rssi: number,
    last_hotspot: {
        id: string,
        name: string,
        lat: number,
        lon: number
    }
}
```

Point
```json
{
    client: string,
    type: 'heltec',
    timestamp: date,
    position: {
        lat: number,
        lon: number,
        speed: number
    }
}
```
