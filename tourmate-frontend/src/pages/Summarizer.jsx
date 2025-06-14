import React, { useState } from "react";

// Define the base URL for your backend API
// Ensure this matches your FastAPI backend's address, including the port
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function Summarizer() {
  const [textContent, setTextContent] = useState(""); // State for the input text content
  const [loading, setLoading] = useState(false);
  const [summaryOutput, setSummaryOutput] = useState(""); // State for the summarized output
  const [error, setError] = useState(""); // State to hold error messages

  const handleChange = (e) => {
    setTextContent(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSummaryOutput(""); // Clear previous summary
    setError(""); // Clear previous errors

    if (!textContent.trim()) {
      setError("Please paste some text content to summarize.");
      setLoading(false);
      return;
    }

    // Prepare the payload for the backend
    const payload = {
      text_content: textContent,
    };

    try {
      // *** IMPORTANT CHANGE HERE: Added /content/ prefix to the URL ***
      const response = await fetch(`${API_BASE_URL}/content/summarize-travel-text/`, {
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
      // Ensure the 'summary' key is correctly accessed from the response
      setSummaryOutput(data.summary || "Could not generate a summary. Please try again or provide different text.");
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
        {/* Heading - Enhanced with emoji */}
        <h1 className="text-5xl font-extrabold mb-3 tracking-tight font-serif">
          📖 Travel Content Summarizer
        </h1>

        {/* Professional Intro paragraph - Enhanced with emojis and refined text */}
        <p className="mb-10 text-lg font-light leading-relaxed font-sans text-gray-300 max-w-3xl">
          Tired of sifting through lengthy travel blogs or articles? ⏳ Our intelligent summarizer is here to help!
          Simply paste any travel-related text content below, and our advanced AI will swiftly
          condense it into a concise, easy-to-read summary. 🚀 Get the key highlights, essential tips,
          and memorable moments at a glance, allowing you to absorb information efficiently and
          plan your adventures smarter. ✨
        </p>

        {/* Form - Textarea for input */}
        <div className="space-y-8 mb-8">
          <div>
            <label className="block mb-2 text-white font-semibold" htmlFor="textContent">
              Paste Travel Content Here
            </label>
            <textarea
              id="textContent"
              name="textContent"
              value={textContent}
              onChange={handleChange}
              rows={15} // Increased rows for more content
              placeholder="e.g., A detailed travel diary, a long article about a destination, etc."
              // Consistent Tailwind styling
              className="w-full bg-transparent border border-gray-600 rounded-md py-2 px-4 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-white transition resize-y"
            ></textarea>
          </div>
        </div>

        {/* Submit button */}
        <div className="text-center mb-12">
          <button
            onClick={handleSubmit}
            disabled={loading}
            // Consistent Tailwind styling
            className="inline-block bg-white text-black font-semibold px-10 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Summarizing content..." : "Summarize Content"}
          </button>
        </div>

        {/* Error display */}
        {error && (
            <div className="bg-red-800 text-white p-4 rounded-lg mb-8 text-center">
                {error}
            </div>
        )}

        {/* Summary Output display */}
        {summaryOutput && (
          <div className="bg-gray-900 p-8 rounded-lg shadow-xl max-h-[600px] overflow-y-auto whitespace-pre-line text-white font-mono text-base leading-relaxed border border-gray-700">
            {summaryOutput}
          </div>
        )}
      </div>
    </div>
  );
}