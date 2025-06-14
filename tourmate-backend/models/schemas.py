# models/schemas.py

from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import date

class ItineraryRequest(BaseModel):
    country: str = Field(..., example="USA")
    city: str = Field(..., example="San Francisco")
    destination: str = Field(..., example="Golden Gate Bridge")
    start_date: date = Field(..., example="2025-06-01")
    end_date: date = Field(..., example="2025-06-07")
    travel_type: str = Field(..., example="adventure")
    additional_info: Optional[str] = Field(None, example="Prefer morning activities")

    @validator("end_date")
    def check_dates(cls, v, values):
        start = values.get("start_date")
        if start and v < start:
            raise ValueError("end_date must be after start_date")
        return v

class ItineraryResponse(BaseModel):
    itinerary_text: str = Field(..., example="Day 1: Arrival and city exploration...")

# --- CODE FOR SUMMARIZER FEATURE (existing) ---
class SummarizeRequest(BaseModel):
    text_content: str = Field(..., example="A long travel blog post about Paris...")

class SummarizeResponse(BaseModel):
    summary: str = Field(..., example="This blog post summarizes a trip to Paris...")

# --- CODE FOR PACKING & SAFETY GUIDER FEATURE (existing) ---
class PackingSafetyRequest(BaseModel):
    destination: str = Field(..., example="Tokyo, Japan")
    travel_dates: str = Field(..., example="mid-October for 7 days") # e.g., "early July for 5 days"
    travel_style: str = Field(..., example="casual explorer") # e.g., "adventure seeker", "budget traveler", "luxury trip"
    activities: Optional[List[str]] = Field(None, example=["hiking", "fine dining", "museums"])
    travelers: Optional[str] = Field(None, example="couple with a toddler") # e.g., "solo female", "family with young kids"

class PackingSafetyResponse(BaseModel):
    guide_text: str = Field(..., example="Your personalized packing list and safety guide for Tokyo...")

# --- NEW CODE FOR EXPENSE & BUDGET HELPER FEATURE ---
class BudgetRequest(BaseModel):
    destination: str = Field(..., example="Kyoto, Japan")
    duration_days: int = Field(..., ge=1, example=7) # Duration in days
    budget_level: str = Field(..., example="Mid-Range", description="e.g., Budget, Mid-Range, Luxury")
    travelers: str = Field(..., example="2 adults") # e.g., "solo", "family with 2 kids"
    accommodation_preference: Optional[str] = Field(None, example="Boutique hotel") # e.g., "hostel", "standard hotel", "luxury villa"
    dining_preference: Optional[str] = Field(None, example="Local street food & casual restaurants") # e.g., "fine dining", "supermarket meals"
    activities_interest: Optional[List[str]] = Field(None, example=["temples", "gardens", "cooking class"])
    travel_month: Optional[str] = Field(None, example="April (Cherry Blossom season)") # Helps with seasonal pricing

    @validator("duration_days")
    def duration_days_positive(cls, v):
        if v <= 0:
            raise ValueError("duration_days must be a positive integer")
        return v

class BudgetResponse(BaseModel):
    budget_details: str = Field(..., example="Your estimated budget for Kyoto...")