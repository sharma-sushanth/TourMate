# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import itinerary # Existing import
from routers import summarizer # Existing import
from routers import packing_safety # Existing import
from routers import budget_helper # --- NEW IMPORT ---
import logging

# Set up basic logging configuration
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="TourMate API",
    description="API for generating AI-powered travel itineraries, content summaries, and travel guides", # Updated description
    version="1.0.0"
)

# Enable CORS for frontend communication — restrict in production if possible
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Replace '*' with frontend URL(s) in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount existing routers
app.include_router(itinerary.router, prefix="/generate", tags=["Itinerary"])
app.include_router(summarizer.router, prefix="/content", tags=["Content Summarizer"])
app.include_router(packing_safety.router, prefix="/guide", tags=["Packing & Safety Guide"])

# --- NEW ROUTER INCLUDE FOR BUDGET HELPER FEATURE ---
app.include_router(budget_helper.router, prefix="/financial", tags=["Budget Helper"])

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up TourMate backend...")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down TourMate backend...")