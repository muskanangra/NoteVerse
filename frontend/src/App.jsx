import React, { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import './styles/globals.css';

export default function App() {
  const [view, setView] = useState('landing');

  // Check auth status on load
  useEffect(() => {
    const token = localStorage.getItem('cherry_notes_token');
    if (token) {
      setView('dashboard');
    }
  }, []);

  const handleLoginSignupSuccess = () => {
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('cherry_notes_token');
    setView('landing');
  };

  // Render correct page view
  switch (view) {
    case 'dashboard':
      return <Dashboard onLogout={handleLogout} />;
    case 'login':
      return <Login setView={setView} onLoginSuccess={handleLoginSignupSuccess} />;
    case 'signup':
      return <Signup setView={setView} onSignupSuccess={handleLoginSignupSuccess} />;
    case 'landing':
    default:
      return <Landing setView={setView} />;
  }
}
