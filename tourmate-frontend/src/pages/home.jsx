// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div
      className="min-h-screen text-white font-[Inter] px-6 py-16 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
      }}
    >
      {/* Background gradient animation */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-purple-500 opacity-20 rounded-full blur-3xl animate-pulse z-0" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-pink-500 opacity-20 rounded-full blur-3xl animate-pulse z-0" />

      {/* Main content */}
      <div className="relative z-10 text-center mb-20">
        <h1
          className="text-6xl font-extrabold tracking-wide text-white relative inline-block"
          style={{
            textShadow:
              '0 0 4px rgba(255, 255, 255, 0.5), 0 0 8px rgba(255, 255, 255, 0.3), 0 0 12px rgba(255, 255, 255, 0.2)',
          }}
        >
          TourMate
        </h1>

        <p className="text-xl text-gray-400 mt-4 max-w-2xl mx-auto">
          Plan your perfect trip effortlessly with TourMate AI!
        </p>
      </div>

      {/* Feature Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Card 1 */}
        <div className="bg-[#fdf6e3] text-black rounded-3xl p-8 shadow-xl hover:scale-[1.03] transition-all duration-300">
          <h2 className="text-3xl font-bold mb-4">🧭 Smart Itinerary Planner</h2>
          <p className="text-lg text-gray-800 mb-6 leading-relaxed">
            No more juggling spreadsheets and blogs. Just enter your destination, dates, and interests — get a perfect day-by-day travel plan generated instantly with AI.
          </p>
          <Link to="/itinerary">
            <button className="bg-black text-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-800 transition">
              Get Started
            </button>
          </Link>
        </div>

        {/* Card 2 - Updated Content */}
        <div className="bg-[#fdf6e3] text-black rounded-3xl p-8 shadow-xl hover:scale-[1.03] transition-all duration-300">
          <h2 className="text-3xl font-bold mb-4">📝 Travel Blog & Review Summarizer</h2>
          <p className="text-lg text-gray-800 mb-6 leading-relaxed">
            Overwhelmed by endless travel blogs and reviews? Let TourMate’s AI distill the web into crisp, insightful summaries—highlighting tips, pros, and hidden gems for your destination.
          </p>
          <Link to="/summarizer">
            <button className="bg-black text-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-800 transition">
              Get Started
            </button>
          </Link>
        </div>

        {/* Card 3 - New Feature */}
        <div className="bg-[#fdf6e3] text-black rounded-3xl p-8 shadow-xl hover:scale-[1.03] transition-all duration-300">
          <h2 className="text-3xl font-bold mb-4">🧳 Packing & Safety Guider</h2>
          <p className="text-lg text-gray-800 mb-6 leading-relaxed">
            Never forget a thing! Get a personalized packing checklist and destination-specific safety tips—powered by AI and tailored to your travel mode, location, and season.
          </p>
          <Link to="/packing-safety">
            <button className="bg-black text-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-800 transition">
              Get Started
            </button>
          </Link>
        </div>

        {/* Card 4 - New Feature */}
        <div className="bg-[#fdf6e3] text-black rounded-3xl p-8 shadow-xl hover:scale-[1.03] transition-all duration-300">
          <h2 className="text-3xl font-bold mb-4">💰 Expense & Budget Helper</h2>
          <p className="text-lg text-gray-800 mb-6 leading-relaxed">
            Travel smart with TourMate’s AI-powered budget planner. Just input your preferences, and get a beautifully detailed budget breakdown with cost-saving tips and flexibility insights.
          </p>
          <Link to="/budget-helper">
            <button className="bg-black text-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-800 transition">
              Get Started
            </button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-24 text-center text-sm text-gray-600">
        © 2025 TourMate. Made with ❤️ for modern explorers.
      </div>
    </div>
  );
};

export default Home;
