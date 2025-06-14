import React, { useState } from "react";
import ReactMarkdown from "react-markdown"; // For rendering markdown output
import remarkGfm from "remark-gfm"; // For GitHub Flavored Markdown support

// Define the base URL for your backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function PackingSafety() {
  const [formData, setFormData] = useState({
    destination: "",
    travelDates: "", // maps to travel_dates in backend
    travelStyle: "",
    activities: "",   // comma-separated activities
    travelers: "",
  });

  const [loading, setLoading] = useState(false);
  const [guideOutput, setGuideOutput] = useState(""); // State for the generated guide
  const [error, setError] = useState(""); // State to hold error messages

  // Predefined options for consistent input
  const travelStyles = [
    "Adventure Seeker",
    "Relaxing Vacation",
    "Cultural Explorer",
    "Budget Traveler",
    "Luxury Trip",
    "Family Trip",
    "Solo Trip",
    "Romantic Getaway",
    "Foodie Trip",
    "Business Trip"
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setGuideOutput(""); // Clear previous output
    setError(""); // Clear previous errors

    // Basic validation
    if (!formData.destination || !formData.travelDates || !formData.travelStyle) {
      setError("Please fill in all required fields: Destination, Travel Dates, and Travel Style.");
      setLoading(false);
      return;
    }

    // Prepare payload for backend, matching Pydantic schema
    const payload = {
      destination: formData.destination,
      travel_dates: formData.travelDates,
      travel_style: formData.travelStyle,
      activities: formData.activities ? formData.activities.split(',').map(item => item.trim()) : [],
      travelers: formData.travelers,
    };

    try {
      // Connect to the backend endpoint for packing & safety
      const response = await fetch(`${API_BASE_URL}/guide/packing-safety/`, {
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
      setGuideOutput(data.guide_text || "Could not generate a guide. Please try again with different inputs.");
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
          🧳 Safety & Packing Navigator
        </h1>

        {/* Professional Intro paragraph with emojis */}
        <p className="mb-10 text-lg font-light leading-relaxed font-sans text-gray-300 max-w-3xl">
          Prepare for your next adventure with confidence! 🗺️ Our AI-powered guide crafts a
          personalized packing checklist tailored to your destination, travel style, and activities.
          It also provides essential safety tips and local insights to ensure a smooth and secure journey.
          Simply tell us about your trip, and let us handle the details. ✨
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
              placeholder="e.g., Tokyo, Japan"
              className="w-full bg-transparent border border-gray-600 rounded-md py-2 px-4 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-white transition"
              required
            />
          </div>

          {/* Travel Dates */}
          <div>
            <label htmlFor="travelDates" className="block mb-2 text-white font-semibold">
              Travel Dates (e.g., mid-October for 7 days)
            </label>
            <input
              type="text"
              id="travelDates"
              name="travelDates"
              value={formData.travelDates}
              onChange={handleChange}
              placeholder="e.g., early July for 5 days"
              className="w-full bg-transparent border border-gray-600 rounded-md py-2 px-4 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-white transition"
              required
            />
          </div>

          {/* Travel Style */}
          <div>
            <label htmlFor="travelStyle" className="block mb-2 text-white font-semibold">
              Travel Style
            </label>
            <select
              id="travelStyle"
              name="travelStyle"
              value={formData.travelStyle}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-600 rounded-md py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white transition appearance-none"
              style={{ backgroundColor: "transparent", color: "white" }}
              required
            >
              <option value="" disabled className="text-gray-400 bg-black">
                Select your travel style
              </option>
              {travelStyles.map((style) => (
                <option key={style} value={style} className="bg-black text-white">
                  {style}
                </option>
              ))}
            </select>
          </div>

          {/* Activities */}
          <div>
            <label htmlFor="activities" className="block mb-2 text-white font-semibold">
              Planned Activities (comma-separated, optional)
            </label>
            <input
              type="text"
              id="activities"
              name="activities"
              value={formData.activities}
              onChange={handleChange}
              placeholder="e.g., hiking, swimming, museum visits, fine dining"
              className="w-full bg-transparent border border-gray-600 rounded-md py-2 px-4 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-white transition"
            />
          </div>

          {/* Travelers */}
          <div className="md:col-span-2">
            <label htmlFor="travelers" className="block mb-2 text-white font-semibold">
              Who are you traveling with? (optional)
            </label>
            <input
              type="text"
              id="travelers"
              name="travelers"
              value={formData.travelers}
              onChange={handleChange}
              placeholder="e.g., solo female traveler, family with young kids, couple"
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
            {loading ? "Generating guide..." : "Generate Packing & Safety Guide"}
          </button>
        </div>

        {/* Error display */}
        {error && (
            <div className="bg-red-800 text-white p-4 rounded-lg mb-8 text-center">
                {error}
            </div>
        )}

        {/* Output display with Markdown rendering */}
        {guideOutput && (
          <div className="bg-gray-900 p-8 rounded-lg shadow-xl max-h-[600px] overflow-y-auto text-white border border-gray-700">
            {/* Apply prose classes to the wrapper div */}
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                // Custom components for consistent styling with Itinerary.jsx
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
                {guideOutput}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}