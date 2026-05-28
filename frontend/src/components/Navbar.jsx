import React from 'react';

export default function Navbar({ setView }) {
  return (
    <nav className="aesthetic-nav">
      <div className="logo-wrapper" onClick={() => setView('landing')} style={{ cursor: 'pointer' }}>
        <span>🍒</span> NoteVerse
      </div>
      <div className="nav-links">
        <a onClick={() => setView('landing')}>Home</a>
        <button onClick={() => setView('login')} className="cute-btn cute-btn-secondary" style={{ padding: '8px 18px', fontSize: '0.9rem' }}>
          Login 🎀
        </button>
        <button onClick={() => setView('signup')} className="cute-btn" style={{ padding: '8px 18px', fontSize: '0.9rem' }}>
          Sign Up ✨
        </button>
      </div>
    </nav>
  );
}
