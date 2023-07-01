from pydantic import BaseModel
from fastapi import FastAPI
from geopy import Nominatim

class CoordniatesBody(BaseModel):
    lat: float
    lon: float

app = FastAPI()

@app.post('/')
async def get_address(coordniates: CoordniatesBody):
    return Nominatim(user_agent='schwering_app_tracker').reverse(f'{coordniates.lat}, {coordniates.lon}').raw
