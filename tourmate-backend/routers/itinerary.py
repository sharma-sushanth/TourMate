# routers/itinerary.py

from fastapi import APIRouter, HTTPException
from models.schemas import ItineraryRequest, ItineraryResponse
from services.gemini_llm import generate_itinerary
import asyncio
import logging

router = APIRouter()
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)  # <-- add basic logging config

@router.post("/generate-itinerary", response_model=ItineraryResponse)
async def get_itinerary(request: ItineraryRequest) -> ItineraryResponse:
    """
    Generate a detailed, day-wise travel itinerary using Gemini LLM.
    """

    prompt = (
        f"Generate a detailed, day-wise travel itinerary for a user visiting "
        f"{request.destination}, {request.city}, {request.country} from {request.start_date} to {request.end_date}. "
        f"The user prefers a {request.travel_type}-based trip. "
        f"Additional preferences: {request.additional_info if request.additional_info else 'None'}. "
        "Please structure the output with:\n"
        "- Clear day-wise breakdowns\n"
        "- Suggested times\n"
        "- Travel tips and local insights"
    )

    try:
        # Run the blocking Gemini API call in a thread
        response = await asyncio.to_thread(generate_itinerary, prompt)

        if not response or response.strip() == "":
            raise ValueError("Empty response from itinerary generator")

        return ItineraryResponse(itinerary_text=response)

    except Exception as e:
        logger.error(f"Error generating itinerary: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate itinerary: {e}")
