# schwering_app_tracker
LoRaWAN GPS tracker module for schwering_app

# Database
## Heltec
Client
```json
{
    id: string,
    name: string,
    type: 'heltec',
    downlink_url: string,
    last_seen: date
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
