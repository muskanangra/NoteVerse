import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import FloatingDecorations from '../components/FloatingDecorations';
import '../styles/landing.css';

export default function Landing({ setView }) {
  return (
    <div className="landing-page">
      <Navbar setView={setView} />
      
      <div style={{ position: 'relative' }}>
        <FloatingDecorations />
        <HeroSection setView={setView} />
      </div>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Handcrafted Features for Thinkers</h2>
          <p>We believe note-taking should feel like creating art.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">🌸</div>
            <h3>Mood Tracking</h3>
            <p>Every note comes with an emotional anchor. Save your memories based on how you felt.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">🎀</div>
            <h3>Scrapbook Styling</h3>
            <p>Varying pastel layouts, handwritten typography styles, and cute floating sticker badges.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">✨</div>
            <h3>Organized Magic</h3>
            <p>Favorite and pin your thoughts. Easy to search, filter by tags, and catalog beautifully.</p>
          </div>
        </div>
      </section>

      {/* Why NoteVerse Section */}
      <section style={{ padding: '80px 8%', textAlign: 'center', background: 'var(--cream)', borderBottom: 'var(--handdrawn-border)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '20px' }}>
            Why NoteVerse?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#5A4A4D', lineHeight: '1.8' }}>
            Most digital notebooks look like work spreadsheets or plain terminal panels. NoteVerse was built for the dreamers. It's a sweet sanctuary where you can design a beautiful catalog of your favorite days, ideas, recipes, and sunset thoughts.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2>Sweet Words from Journalers</h2>
          <p>See why creative souls are switching their digital journaling spaces.</p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-tape">love it!</div>
            <p>"I've never looked forward to writing daily lists until I found this app. The pastel papers and stickers make it feel like my physical diary!"</p>
            <div className="testimonial-author">
              <div className="author-avatar">L</div>
              <div>
                <h5 style={{ fontWeight: 'bold' }}>Lila Rose</h5>
                <span style={{ fontSize: '0.8rem', color: 'grey' }}>Pinterest Creator</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-tape">cozy space</div>
            <p>"Having a space to log my rainy day coffee shop ideas and favorite books has changed how I romanticize my daily habits. Truly gorgeous."</p>
            <div className="testimonial-author">
              <div className="author-avatar">C</div>
              <div>
                <h5 style={{ fontWeight: 'bold' }}>Chloe Mae</h5>
                <span style={{ fontSize: '0.8rem', color: 'grey' }}>Artist & Writer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-banner">
        <h2>Start your aesthetic scrapbook today</h2>
        <p>Join thousands of dreamers romanticizing their digital note-taking.</p>
        <button onClick={() => setView('signup')} className="cute-btn cute-btn-secondary" style={{ fontSize: '1.1rem', padding: '12px 32px' }}>
          Create Free Account ✨
        </button>
      </section>

      <Footer />
    </div>
  );
}
