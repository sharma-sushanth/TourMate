import React, { useState } from "react";
import ReactMarkdown from "react-markdown"; // For rendering markdown output
import remarkGfm from "remark-gfm"; // For GitHub Flavored Markdown support

// Define the base URL for your backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function BudgetHelper() {
  const [formData, setFormData] = useState({
    destination: "",
    durationDays: "", // maps to duration_days in backend
    budgetLevel: "",
    travelers: "",
    accommodationPreference: "",
    diningPreference: "",
    activitiesInterest: "", // comma-separated activities
    travelMonth: "",
  });

  const [loading, setLoading] = useState(false);
  const [budgetOutput, setBudgetOutput] = useState(""); // State for the generated budget
  const [error, setError] = useState(""); // State to hold error messages

  // Predefined options for consistent input
  const budgetLevels = [
    "Frugal (Backpacking/Hostels)",
    "Mid-Range (Comfortable, Value-Focused)",
    "Comfort (Good Hotels, Varied Dining)",
    "Luxury (High-End Experiences)"
  ];

  const accommodationOptions = [
    "Hostel/Guesthouse", "Budget Hotel", "Mid-Range Hotel", "Boutique Hotel",
    "Luxury Hotel/Resort", "Vacation Rental (Airbnb)", "Camping"
  ];

  const diningOptions = [
    "Street Food/Supermarket", "Casual Local Restaurants", "Mix of Casual & Mid-Range",
    "Fine Dining Focus"
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setBudgetOutput(""); // Clear previous output
    setError(""); // Clear previous errors

    // Basic validation
    if (!formData.destination || !formData.durationDays || !formData.budgetLevel || !formData.travelers) {
      setError("Please fill in all required fields: Destination, Duration, Budget Level, and Travelers.");
      setLoading(false);
      return;
    }

    // Prepare payload for backend, matching Pydantic schema
    const payload = {
      destination: formData.destination,
      duration_days: parseInt(formData.durationDays), // Ensure it's an integer
      budget_level: formData.budgetLevel,
      travelers: formData.travelers,
      accommodation_preference: formData.accommodationPreference || null,
      dining_preference: formData.diningPreference || null,
      activities_interest: formData.activitiesInterest ? formData.activitiesInterest.split(',').map(item => item.trim()) : [],
      travel_month: formData.travelMonth || null,
    };

    try {
      // Connect to the backend endpoint for budget helper
      const response = await fetch(`${API_BASE_URL}/financial/budget-helper/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setBudgetOutput(data.budget_details || "Could not generate a budget guide. Please try again with different inputs.");
    } catch (err) {
      setError("Error: " + err.message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-12 px-6 sm:px-12 lg:px-24">
      <div className="w-full max-w-5xl">
        {/* Heading */}
        <h1 className="text-5xl font-extrabold mb-3 tracking-tight font-serif">
          💸 Travel Expense & Budget Helper
        </h1>

        {/* Professional Intro paragraph with emojis */}
        <p className="mb-10 text-lg font-light leading-relaxed font-sans text-gray-300 max-w-3xl">
          Take control of your travel finances! 📊 Our smart budget helper provides a
          personalized expense breakdown and savvy money-saving tips for your next trip.
          Input your destination, duration, and preferences, and let our AI assist you
          in planning your expenditures wisely. Travel smarter, not harder. ✨
        </p>

        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Destination */}
          <div>
            <label htmlFor="destination" className="block mb-2 text-white font-semibold">
              Destination
            </label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="e.g., Rome, Italy"
              className="w-full bg-transparent border border-gray-600 rounded-md py-2 px-4 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-white transition"
              required
            />
          </div>

          {/* Duration in Days */}
          <div>
            <label htmlFor="durationDays" className="block mb-2 text-white font-semibold">
              Duration (in days)
            </label>
            <input
              type="number"
              id="durationDays"
              name="durationDays"
              value={formData.durationDays}
              onChange={handleChange}
              placeholder="e.g., 7"
              min="1"
              className="w-full bg-transparent border border-gray-600 rounded-md py-2 px-4 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-white transition"
              required
            />
          </div>

          {/* Budget Level */}
          <div>
            <label htmlFor="budgetLevel" className="block mb-2 text-white font-semibold">
              Your Desired Budget Level
            </label>
            <select
              id="budgetLevel"
              name="budgetLevel"
              value={formData.budgetLevel}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-600 rounded-md py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white transition appearance-none"
              style={{ backgroundColor: "transparent", color: "white" }}
              required
            >
              <option value="" disabled className="text-gray-400 bg-black">
                Select budget level
              </option>
              {budgetLevels.map((level) => (
                <option key={level} value={level.split(' ')[0]} className="bg-black text-white">
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Travelers */}
          <div>
            <label htmlFor="travelers" className="block mb-2 text-white font-semibold">
              Number & Type of Travelers
            </label>
            <input
              type="text"
              id="travelers"
              name="travelers"
              value={formData.travelers}
              onChange={handleChange}
              placeholder="e.g., solo, 2 adults, family with 2 kids"
              className="w-full bg-transparent border border-gray-600 rounded-md py-2 px-4 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-white transition"
              required
            />
          </div>

          {/* Accommodation Preference */}
          <div>
            <label htmlFor="accommodationPreference" className="block mb-2 text-white font-semibold">
              Accommodation Preference (optional)
            </label>
            <select
              id="accommodationPreference"
              name="accommodationPreference"
              value={formData.accommodationPreference}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-600 rounded-md py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white transition appearance-none"
              style={{ backgroundColor: "transparent", color: "white" }}
            >
              <option value="" className="text-gray-400 bg-black">
                Any / Not specified
              </option>
              {accommodationOptions.map((option) => (
                <option key={option} value={option} className="bg-black text-white">
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Dining Preference */}
          <div>
            <label htmlFor="diningPreference" className="block mb-2 text-white font-semibold">
              Dining Preference (optional)
            </label>
            <select
              id="diningPreference"
              name="diningPreference"
              value={formData.diningPreference}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-600 rounded-md py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white transition appearance-none"
              style={{ backgroundColor: "transparent", color: "white" }}
            >
              <option value="" className="text-gray-400 bg-black">
                Any / Not specified
              </option>
              {diningOptions.map((option) => (
                <option key={option} value={option} className="bg-black text-white">
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Activities Interest */}
          <div className="md:col-span-2">
            <label htmlFor="activitiesInterest" className="block mb-2 text-white font-semibold">
              Key Activities / Interests (comma-separated, optional)
            </label>
            <input
              type="text"
              id="activitiesInterest"
              name="activitiesInterest"
              value={formData.activitiesInterest}
              onChange={handleChange}
              placeholder="e.g., museums, outdoor adventures, shopping, nightlife"
              className="w-full bg-transparent border border-gray-600 rounded-md py-2 px-4 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-white transition"
            />
          </div>

          {/* Travel Month/Season */}
          <div className="md:col-span-2">
            <label htmlFor="travelMonth" className="block mb-2 text-white font-semibold">
              Travel Month/Season (optional)
            </label>
            <input
              type="text"
              id="travelMonth"
              name="travelMonth"
              value={formData.travelMonth}
              onChange={handleChange}
              placeholder="e.g., July, Winter, Cherry Blossom season"
              className="w-full bg-transparent border border-gray-600 rounded-md py-2 px-4 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-white transition"
            />
          </div>
        </div>

        {/* Submit button */}
        <div className="text-center mb-12">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-block bg-white text-black font-semibold px-10 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Generating budget..." : "Generate Budget Estimate"}
          </button>
        </div>

        {/* Error display */}
        {error && (
            <div className="bg-red-800 text-white p-4 rounded-lg mb-8 text-center">
                {error}
            </div>
        )}

        {/* Output display with Markdown rendering */}
        {budgetOutput && (
          <div className="bg-gray-900 p-8 rounded-lg shadow-xl max-h-[600px] overflow-y-auto text-white border border-gray-700">
            {/* Apply prose classes to the wrapper div */}
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                // Custom components for consistent styling
                components={{
                  h1: ({node, ...props}) => <h1 className="text-4xl font-extrabold my-6 text-white" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-3xl font-bold my-5 text-gray-200 border-b border-gray-700 pb-2" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-2xl font-semibold my-4 text-gray-300" {...props} />,
                  h4: ({node, ...props}) => <h4 className="text-xl font-medium my-3 text-gray-400" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 pl-5 space-y-1" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 pl-5 space-y-1" {...props} />,
                  li: ({node, ...props}) => <li className="mb-1" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                  em: ({node, ...props}) => <em className="italic text-gray-400" {...props} />,
                  a: ({node, ...props}) => <a className="text-blue-400 hover:underline" {...props} />,
                  table: ({node, ...props}) => <table className="table-auto w-full my-4 border-collapse border border-gray-600" {...props} />,
                  thead: ({node, ...props}) => <thead className="bg-gray-800" {...props} />,
                  th: ({node, ...props}) => <th className="border border-gray-700 px-4 py-2 text-left text-gray-300 font-semibold" {...props} />,
                  tbody: ({node, ...props}) => <tbody className="bg-gray-850" {...props} />,
                  td: ({node, ...props}) => <td className="border border-gray-700 px-4 py-2" {...props} />,
                }}
              >
                {budgetOutput}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}