'''# services/gemini_llm.py

import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def generate_itinerary(prompt: str) -> str:
    try:
        model = genai.GenerativeModel(model_name="gemini-1.5-flash-latest")
        chat = model.start_chat()
        response = chat.send_message(prompt)
        return response.text
    except Exception as e:
        return f"Error generating itinerary: {e}" '''

 # services/gemini_llm.py

import os
import time
import logging
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the Gemini API key and model name from environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL_NAME = os.getenv("GEMINI_MODEL_NAME", "gemini-1.5-flash-latest")

# Validate API key
if not GEMINI_API_KEY:
    raise EnvironmentError("Missing GEMINI_API_KEY environment variable.")

# Configure the Gemini client
genai.configure(api_key=GEMINI_API_KEY)

# Setup logger for structured monitoring
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def generate_itinerary(prompt: str, max_retries: int = 3, backoff_factor: float = 1.5) -> str:
    """
    Calls the Gemini LLM API to generate a travel itinerary based on the provided prompt.

    Args:
        prompt (str): The prompt string to be sent to the LLM.
        max_retries (int): Number of retries in case of transient errors (default: 3).
        backoff_factor (float): Delay multiplier between retries (default: 1.5).

    Returns:
        str: The generated itinerary text, or an error message on failure.
    """
    attempt = 0

    while attempt < max_retries:
        try:
            model = genai.GenerativeModel(model_name=GEMINI_MODEL_NAME)
            chat = model.start_chat()
            response = chat.send_message(prompt)
            logger.info("✅ Gemini API call successful.")
            return response.text

        except Exception as e:
            attempt += 1
            logger.error(f"❌ Attempt {attempt}: Error generating itinerary: {e}")

            if attempt >= max_retries:
                return f"Error generating itinerary after {max_retries} attempts: {e}"

            sleep_time = backoff_factor ** attempt
            logger.info(f"⏳ Retrying in {sleep_time:.2f} seconds...")
            time.sleep(sleep_time)


