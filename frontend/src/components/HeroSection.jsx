import React from 'react';

export default function HeroSection({ setView }) {
  return (
    <section className="hero-section notebook-grid">
      <div className="hero-badge">🌸 Meet NoteVerse</div>
      <h1 className="hero-title">
        The dreamy, <span>scrapbook space</span> for your cozy thoughts
      </h1>
      <p className="hero-description">
        Ditch the corporate spreadsheets. Romanticize your journaling, design digital memory boards, track your moods, and save songs that feel like sunsets.
      </p>
      <div className="hero-cta">
        <button onClick={() => setView('signup')} className="cute-btn">
          Start Journaling Free 🎀
        </button>
        <button onClick={() => setView('login')} className="cute-btn cute-btn-secondary">
          Welcome Back ✨
        </button>
      </div>
      
      {/* Visual scrapbook preview elements */}
      <div style={{
        marginTop: '60px',
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        zIndex: 5,
        position: 'relative'
      }}>
        <div className="paper-sheet" style={{ padding: '20px', width: '220px', transform: 'rotate(-2deg)', background: '#FFD5E0' }}>
          <h4 style={{ fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>🌸 Sunset playlist</h4>
          <p style={{ fontSize: '0.8rem' }}>1. Strawberry Fields<br />2. Frank Ocean<br />3. Summer Salt</p>
          <span style={{ fontSize: '0.75rem', display: 'block', marginTop: '12px', opacity: 0.6 }}>mood: dreamy</span>
        </div>
        <div className="paper-sheet" style={{ padding: '20px', width: '220px', transform: 'rotate(3deg)', background: '#D6EADF' }}>
          <h4 style={{ fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>🍵 cafe idea</h4>
          <p style={{ fontSize: '0.8rem' }}>Green velvet stools, freshly baked cherry tarts, matcha lattes in ceramic bowls.</p>
          <span style={{ fontSize: '0.75rem', display: 'block', marginTop: '12px', opacity: 0.6 }}>mood: cozy</span>
        </div>
        <div className="paper-sheet" style={{ padding: '20px', width: '220px', transform: 'rotate(-1deg)', background: '#FCF4DD' }}>
          <h4 style={{ fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>🎀 daily joy</h4>
          <p style={{ fontSize: '0.8rem' }}>A fresh bunch of tulips on my desk and sweet warm rain outside.</p>
          <span style={{ fontSize: '0.75rem', display: 'block', marginTop: '12px', opacity: 0.6 }}>mood: soft</span>
        </div>
      </div>
    </section>
  );
}
