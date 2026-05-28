import React from 'react';
import { Search, Menu, Plus } from 'lucide-react';

export default function Topbar({ searchQuery, setSearchQuery, onNewNoteClick, toggleSidebar, notesCount }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning, Cherry 🌸';
    if (hour < 18) return 'Good Afternoon, Sweetie 🍒';
    return 'Good Evening, Darling ✨';
  };

  return (
    <div className="topbar">
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="menu-toggle-btn" onClick={toggleSidebar} style={{ padding: '8px', border: 'var(--handdrawn-border)', borderRadius: '8px' }}>
          <Menu size={20} />
        </button>
        <div>
          <h2>{getGreeting()}</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--soft-berry)', fontWeight: '500' }}>
            You have gathered {notesCount} thoughts in your digital scrapbook.
          </p>
        </div>
      </div>

      <div className="topbar-right">
        <div className="search-bar-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search notes or moods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button onClick={onNewNoteClick} className="cute-btn">
          <Plus size={16} /> New Scrap 🎀
        </button>
      </div>
    </div>
  );
}
