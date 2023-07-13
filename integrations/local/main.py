from fastapi import FastAPI
import tabs

app = FastAPI(
    openapi_url=None,
    docs_url=None,
    redoc_url=None,
)

app.include_router(tabs.router)
