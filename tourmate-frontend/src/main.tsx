/**
 * main.jsx
 * -------------------------
 * Entry point for the TourMate React application.
 * 
 * - Initializes ReactDOM with root element
 * - Wraps the app with React.StrictMode for highlighting potential problems
 * - Loads global styles from index.css
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
