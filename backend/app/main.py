import os
from fastapi import FastAPI
from app.routes import health, login
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware


load_dotenv()

app = FastAPI(
    title="VISTRA API",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("LOCAL_FRONTEND_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(login.router)