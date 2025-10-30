from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Dale API",
    description="Ride-sharing platform API",
    version="1.0.0",
)

# CORS Configuration
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "Dale API"}

@app.get("/")
async def root():
    """Root endpoint with API info"""
    return {
        "message": "Dale Ride-Sharing API",
        "version": "1.0.0",
        "docs": "/docs",
    }

# TODO: Include routers when implemented
# from app.api.routes import rides, bookings, users
# app.include_router(rides.router, prefix="/api/rides", tags=["Rides"])
# app.include_router(bookings.router, prefix="/api/bookings", tags=["Bookings"])
# app.include_router(users.router, prefix="/api/users", tags=["Users"])
