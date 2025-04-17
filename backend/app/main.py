from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

@app.get("/")
async def root():
    return {"message": "Welcome to AUNTY'S COMFORT FOOD LIMITED Restaurant Management System API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
