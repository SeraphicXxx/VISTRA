import os
from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import Config
from app.routes import health, login


app = FastAPI(
    title="VISTRA API",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[Config.PROD_FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(login.admin_auth_router)