# routers/summarizer.py

from fastapi import APIRouter, HTTPException
from models.schemas import SummarizeRequest, SummarizeResponse # Import the new schema
from services.gemini_llm import generate_itinerary # Reuse the existing LLM service
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/summarize-travel-text/", response_model=SummarizeResponse)
async def summarize_travel_text(request: SummarizeRequest):
    """
    Summarizes provided travel blog content using the LLM.
    """
    try:
        # Design your prompt for summarization.
        # This prompt is crucial for getting the desired output from Gemini.
        prompt = f"""
        Please summarize the following travel blog post or detailed travel content.
        Focus on the main destinations, unique experiences, practical travel tips,
        and any memorable highlights. The summary should be concise,
        approximately 100-150 words, and easy for a traveler to quickly grasp.

        Travel Content to Summarize:
        ---
        {request.text_content}
        ---

        Concise Summary:
        """

        logger.info(f"Sending text for summarization to LLM. Content length: {len(request.text_content)} chars.")
        
        # Reuse the existing LLM generation function
        # Its name 'generate_itinerary' is generic enough to send any prompt.
        summarized_text = generate_itinerary(prompt)

        if "Error generating itinerary" in summarized_text:
            logger.error(f"LLM service returned an error: {summarized_text}")
            raise HTTPException(status_code=500, detail="LLM service failed to generate summary.")

        logger.info("Successfully received summary from LLM.")
        return {"summary": summarized_text}

    except HTTPException as e:
        raise e # Re-raise FastAPI HTTPExceptions
    except Exception as e:
        logger.error(f"An unexpected error occurred during summarization: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error during summarization: {e}")