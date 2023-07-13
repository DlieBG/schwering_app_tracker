from pydantic import BaseModel
from datetime import datetime

class DC(BaseModel):
    balance: int
    nonce: int

class Hotspot(BaseModel):
    channel: int
    frequency: float
    id: str
    lat: float
    long: float
    name: str
    reported_at: datetime
    rssi: int
    snr: float
    spreading: str
    status: str

class Label(BaseModel):
    id: str
    name: str
    organization_id: str

class Metadata(BaseModel):
    labels: list[Label]
    organization_id: str

class PayloadBody(BaseModel):
    app_eui: str
    dc: DC
    dev_eui: str
    devaddr: str
    downlink_url: str
    fcnt: int
    hotspots: list[Hotspot]
    id: str
    metadata: Metadata
    name: str
    payload: str
    port: int
    reported_at: datetime
