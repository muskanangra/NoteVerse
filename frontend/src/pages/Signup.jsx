import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { notesApi } from '../api/notesApi';
import '../styles/auth.css';

export default function Signup({ setView, onSignupSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      await notesApi.signup(email, password);
      onSignupSuccess();
    } catch (err) {
      setError(err.message || 'Registration failed');
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
          <h2 className="auth-logo">🍒 Join the Club</h2>
          <p className="auth-subtitle">Create your digital memory diary</p>
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
            <label>Choose Password</label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <input
                type="password"
                placeholder="Minimum 6 characters"
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
            {loading ? 'Creating Diary...' : 'Create Diary 🎀'}
          </button>
        </form>

        <p className="auth-footer-text">
          Already a club member?{' '}
          <span onClick={() => setView('login')}>Sign in ✨</span>
        </p>
      </div>
    </div>
  );
}
