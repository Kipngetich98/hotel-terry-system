from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router

app = FastAPI(
    title="AUNTY'S COMFORT FOOD LIMITED API",
    description="Restaurant Management System API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to AUNTY'S COMFORT FOOD LIMITED Restaurant Management System API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
