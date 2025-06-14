# routers/budget_helper.py

from fastapi import APIRouter, HTTPException
from models.schemas import BudgetRequest, BudgetResponse # Import the new schema
from services.gemini_llm import generate_itinerary # Reuse the existing LLM service
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/budget-helper/", response_model=BudgetResponse)
async def get_travel_budget_guide(request: BudgetRequest):
    """
    Generates a personalized travel budget estimate and tips using the LLM.
    """
    try:
        # Craft a professional and helpful prompt for the LLM
        budget_prompt = f"""
        As a highly experienced travel financial advisor and budget planner, provide a detailed, itemized budget estimate and practical money-saving tips for a trip with the following details:

        **Trip Details:**
        - **Destination:** {request.destination}
        - **Duration:** {request.duration_days} days
        - **Budget Level:** {request.budget_level} (e.g., Frugal, Mid-Range, Luxury)
        - **Travelers:** {request.travelers}
        - **Accommodation Preference:** {request.accommodation_preference if request.accommodation_preference else 'Not specified'}
        - **Dining Preference:** {request.dining_preference if request.dining_preference else 'Not specified'}
        - **Activities Interest:** {', '.join(request.activities_interest) if request.activities_interest else 'Not specified'}
        - **Travel Month/Season:** {request.travel_month if request.travel_month else 'Not specified'}

        **Your response must be structured clearly and be highly actionable. Include:**

        ### 💰 Estimated Daily & Total Costs
        (Provide a breakdown for each category with estimated *ranges* per day and total for the trip in USD. Specify typical ranges for your chosen budget level. If specific currency is known for destination, mention it. Use tables or clear bullet points for readability.)
        * **Accommodation:**
        * **Food & Dining:**
        * **Local Transportation:**
        * **Activities & Sightseeing:**
        * **Miscellaneous/Contingency:** (e.g., souvenirs, small emergencies, tips)

        ### ✨ Smart Money-Saving Tips & Advice
        (Provide practical, actionable tips relevant to the destination and budget level. Think about local transportation, food, free activities, booking strategies, etc.)

        ### ⚠️ Important Financial Considerations
        (Highlight any common hidden costs, visa fees, travel insurance recommendations, currency exchange advice, tipping etiquette, or other financial pitfalls to avoid in the specified destination.)

        Aim for a comprehensive, yet easy-to-understand guide. Use appropriate markdown for headings and lists. Be encouraging and empowering for the traveler.
        """

        logger.info(f"Generating budget guide for {request.destination} for {request.duration_days} days.")

        # Reuse the generic LLM function
        budget_text = generate_itinerary(budget_prompt)

        if "Error generating itinerary" in budget_text:
            logger.error(f"LLM service returned an error for budget helper: {budget_text}")
            raise HTTPException(status_code=500, detail="LLM service failed to generate budget guide.")

        logger.info("Successfully received budget guide from LLM.")
        return {"budget_details": budget_text}

    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"An unexpected error occurred while generating budget guide: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")