import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { notesApi } from '../api/notesApi';
import '../styles/auth.css';

export default function Login({ setView, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await notesApi.login(email, password);
      onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Incorrect email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page notebook-grid">
      <div 
        onClick={() => setView('landing')} 
        style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontWeight: 600,
          cursor: 'pointer',
          color: 'var(--cherry-red)',
          zIndex: 20
        }}
      >
        <ArrowLeft size={16} /> Back Home
      </div>

      <div className="auth-container">
        {/* Layered paper background effects */}
        <div className="auth-paper-back"></div>
        <div className="auth-paper-back-2"></div>

        <div className="auth-header">
          <h2 className="auth-logo">🍒 Welcome Back</h2>
          <p className="auth-subtitle">Log in to enter your notes universe</p>
        </div>

        {error && <div className="auth-error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label>Email Address</label>
            <div className="auth-input-wrapper">
              <Mail size={16} className="auth-input-icon" />
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label>Password</label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="cute-btn auth-submit-btn" 
            disabled={loading}
          >
            {loading ? 'Entering Universe...' : 'Enter Universe ✨'}
          </button>
        </form>

        <p className="auth-footer-text">
          Don't have a diary yet?{' '}
          <span onClick={() => setView('signup')}>Create one 🎀</span>
        </p>
      </div>
    </div>
  );
}
