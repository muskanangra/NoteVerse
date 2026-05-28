import React from 'react';

export default function Footer() {
  return (
    <footer className="aesthetic-footer">
      <div className="footer-content">
        <div className="footer-logo">🍒 NoteVerse</div>
        <p style={{ maxWidth: '400px', fontSize: '0.9rem', color: '#BBA5A8', margin: '0 auto' }}>
          Your digital diary, scrapbook, and thought space. Cozy productivity for romanticizing everyday thoughts.
        </p>
        <div className="footer-socials">
          <a href="#">Pinterest 📌</a>
          <a href="#">Instagram 📸</a>
        </div>
      </div>
      <p style={{ fontSize: '0.8rem', color: '#887477', borderTop: '1px dashed #4A3A3D', paddingTop: '20px' }}>
        © {new Date().getFullYear()} NoteVerse. Handcrafted with love & pastel cherries.
      </p>
    </footer>
  );
}
