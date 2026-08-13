from fastapi import FastAPI
from app.routes import health, login

app = FastAPI(
    title="VISTRA API",
    version="1.0.0"
)

app.include_router(health.router)
app.include_router(login.router)