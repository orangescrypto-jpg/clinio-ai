import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Prevent flash of wrong theme on load
try {
  const stored = localStorage.getItem('tetherng-theme');
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed?.state?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }
} catch { /* ignore */ }

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
