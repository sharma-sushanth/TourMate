# routers/packing_safety.py

from fastapi import APIRouter, HTTPException
from models.schemas import PackingSafetyRequest, PackingSafetyResponse # Import the new schema
from services.gemini_llm import generate_itinerary # Reuse the existing LLM service
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/packing-safety/", response_model=PackingSafetyResponse)
async def get_packing_safety_guide(request: PackingSafetyRequest):
    """
    Generates a personalized packing checklist and safety guide using the LLM.
    """
    try:
        # Craft a powerful prompt for the LLM based on user inputs
        packing_prompt = f"""
        As an expert travel guide, generate a comprehensive and personalized packing checklist and a detailed safety guide for a trip to {request.destination}.

        Here are the trip details:
        - **Destination:** {request.destination}
        - **Travel Dates:** {request.travel_dates}
        - **Travel Style:** {request.travel_style}
        - **Activities:** {', '.join(request.activities) if request.activities else 'Not specified'}
        - **Travelers:** {request.travelers if request.travelers else 'Not specified'}

        **Your response should be structured as follows:**

        ### 🧳 Personalized Packing Checklist
        (Provide a detailed, bulleted list of essential items, considering weather, activities, and travel style. Include categories like Clothing, Footwear, Documents, Health & Toiletries, Electronics, Miscellaneous. Add a few specific recommendations relevant to the destination/style.)

        ### 🚨 Safety & Precaution Guide
        (Provide key safety tips, local laws or customs to be aware of, common scams, emergency contacts/numbers, health precautions, and advice on navigating safely, considering the destination and traveler type. Use bullet points or short paragraphs.)

        Ensure the language is encouraging and practical.
        """

        logger.info(f"Generating packing and safety guide for {request.destination}.")

        # Use the generic LLM function
        guide_text = generate_itinerary(packing_prompt)

        if "Error generating itinerary" in guide_text:
            logger.error(f"LLM service returned an error for packing/safety: {guide_text}")
            raise HTTPException(status_code=500, detail="LLM service failed to generate packing and safety guide.")

        logger.info("Successfully received packing and safety guide from LLM.")
        return {"guide_text": guide_text}

    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"An unexpected error occurred while generating packing/safety guide: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")