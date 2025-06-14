import React, { useState } from "react";
import ReactMarkdown from "react-markdown"; // Import ReactMarkdown
import remarkGfm from "remark-gfm"; // Import remarkGfm for GitHub Flavored Markdown

// Define the base URL for your backend API
// It's highly recommended to use environment variables for this.
// For Vite, use VITE_ prefix (e.g., VITE_API_BASE_URL)
// For Create React App, use REACT_APP_ prefix (e.g., REACT_APP_API_BASE_URL)
// Create a .env file in your frontend root directory like this:
// VITE_API_BASE_URL=http://localhost:8000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function Itinerary() {
  const [formData, setFormData] = useState({
    country: "",
    stateCity: "", // This maps to 'city' in backend payload
    destination: "",
    startDate: "",
    endDate: "",
    travelType: "",
    additionalInfo: "",
  });

  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState(""); // State to hold error messages

  const travelTypes = [
    "Historical",
    "Adventure",
    "Children",
    "Food",
    "Culture",
    "Nature/Natural",
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setOutput(""); // Clear previous output
    setError(""); // Clear previous errors

    // Basic validation
    if (!formData.country || !formData.stateCity || !formData.startDate || !formData.endDate || !formData.travelType) {
      setError("Please fill in all required fields (Country, City, Start Date, End Date, Travel Type).");
      setLoading(false);
      return;
    }

    const payload = {
      country: formData.country,
      city: formData.stateCity, // Map stateCity to city for backend payload keys
      destination: formData.destination,
      start_date: formData.startDate,
      end_date: formData.endDate,
      travel_type: formData.travelType,
      additional_info: formData.additionalInfo,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/generate/generate-itinerary`, {
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

      setOutput(data.itinerary_text || "No itinerary returned from the AI. Please try again with different inputs.");
    } catch (err) {
      setError("Error: " + err.message);
      console.error("Fetch error:", err); // Log error for deeper debugging if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-12 px-6 sm:px-12 lg:px-24">
      <div className="w-full max-w-5xl">
        {/* Heading */}
        <h1 className="text-5xl font-extrabold mb-5 tracking-tight font-serif">
          Travel Itinerary Planner
        </h1>

        {/* Intro paragraph */}
        <p className="mb-12 text-lg font-light leading-relaxed font-sans text-gray-300 max-w-3xl">
          Welcome to the Travel Itinerary Planner — your smart AI companion for
          crafting a seamless and personalized trip experience. Simply fill in
          your travel details, select your interests, and our advanced AI will
          generate a day-by-day itinerary tailored to your preferences. Use this
          planner to discover hidden gems, optimize your time, and make your
          journey unforgettable.
        </p>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <label
              htmlFor="country"
              className="block mb-2 text-white font-semibold tracking-wide"
            >
              Travel Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="e.g. France"
              className="w-full bg-transparent border border-gray-600 rounded-md py-2 px-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white transition"
              required // Added required attribute
            />
          </div>

          <div>
            <label
              htmlFor="stateCity"
              className="block mb-2 text-white font-semibold tracking-wide"
            >
              Travel State/City
            </label>
            <input
              type="text"
              id="stateCity"
              name="stateCity"
              value={formData.stateCity}
              onChange={handleChange}
              placeholder="e.g. Paris"
              className="w-full bg-transparent border border-gray-600 rounded-md py-2 px-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white transition"
              required // Added required attribute
            />
          </div>

          <div>
            <label
              htmlFor="destination"
              className="block mb-2 text-white font-semibold tracking-wide"
            >
              Destination (Specific Place, e.g., Eiffel Tower)
            </label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Eiffel Tower, Louvre, etc. (Optional, AI will generate if blank)"
              className="w-full bg-transparent border border-gray-600 rounded-md py-2 px-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white transition"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label
                htmlFor="startDate"
                className="block mb-2 text-white font-semibold tracking-wide"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full bg-transparent border border-gray-600 rounded-md py-2 px-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white transition"
                required // Added required attribute
              />
            </div>

            <div className="flex-1">
              <label
                htmlFor="endDate"
                className="block mb-2 text-white font-semibold tracking-wide"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full bg-transparent border border-gray-600 rounded-md py-2 px-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white transition"
                required // Added required attribute
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="travelType"
              className="block mb-2 text-white font-semibold tracking-wide"
            >
              Travel Type
            </label>
            <select
              id="travelType"
              name="travelType"
              value={formData.travelType}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-600 rounded-md py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white transition appearance-none"
              style={{ backgroundColor: "transparent", color: "white" }} // Ensures text color is white in select
              required // Added required attribute
            >
              <option value="" disabled className="text-gray-400">
                Select Travel Type
              </option>
              {travelTypes.map((type) => (
                <option
                  key={type}
                  value={type.toLowerCase()}
                  className="bg-black text-white" // Ensures options are visible in dark mode
                >
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="additionalInfo"
              className="block mb-2 text-white font-semibold tracking-wide"
            >
              Additional Info (constraints, transport, notes)
            </label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              rows={4}
              placeholder="Anything extra you'd like to add, e.g., 'Prefer public transport', 'Avoid crowded places', 'Interested in local markets'."
              className="w-full bg-transparent border border-gray-600 rounded-md py-2 px-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white transition resize-none"
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
            {loading ? "Generating your plan..." : "Click here to generate your plan"}
          </button>
        </div>

        {/* Error display */}
        {error && (
            <div className="bg-red-800 text-white p-4 rounded-lg mb-8 text-center">
                {error}
            </div>
        )}

        {/* Output display with Markdown rendering */}
        {output && (
          <div className="bg-gray-900 p-8 rounded-lg shadow-xl max-h-[600px] overflow-y-auto text-white border border-gray-700">
            {/* Apply prose classes to the wrapper div */}
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                // Custom components to apply Tailwind classes to specific Markdown elements
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
                  // Add more components if you need to style other Markdown elements (e.g., blockquote, code, img)
                  table: ({node, ...props}) => <table className="table-auto w-full my-4 border-collapse border border-gray-600" {...props} />,
                  thead: ({node, ...props}) => <thead className="bg-gray-800" {...props} />,
                  th: ({node, ...props}) => <th className="border border-gray-700 px-4 py-2 text-left text-gray-300 font-semibold" {...props} />,
                  tbody: ({node, ...props}) => <tbody className="bg-gray-850" {...props} />,
                  td: ({node, ...props}) => <td className="border border-gray-700 px-4 py-2" {...props} />,
                }}
              >
                {output}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}