import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Page imports
import Home from './pages/home';
import Itinerary from './pages/Itinerary';
import Suggestions from './pages/Summarizer';
import PackingSafety from './pages/PackingSafety';     // NEW
import BudgetHelper from './pages/BudgetHelper';       // NEW

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<Home />} />

        {/* AI-powered itinerary generation */}
        <Route path="/itinerary" element={<Itinerary />} />

        {/* Travel blog & review summarizer */}
        <Route path="/summarizer" element={<Suggestions />} />

        {/* Packing & safety guide generator */}
        <Route path="/packing-safety" element={<PackingSafety />} />

        {/* Budget planning assistant */}
        <Route path="/budget-helper" element={<BudgetHelper />} />
      </Routes>
    </Router>
  );
}

export default App;
