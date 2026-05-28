import React from 'react';
import { Book, Pin, Heart, LogOut, X, Award, CheckCircle, Circle, Home, CheckSquare, Calendar } from 'lucide-react';

export default function Sidebar({ activePage = 'hub', setActivePage, userEmail, onLogout, isOpen, setIsOpen, notes = [] }) {
  const menuItems = [
    { id: 'hub', label: '🏠 Scrapbook Hub', icon: <Home size={18} /> },
    { id: 'notes', label: '📔 Notes Universe', icon: <Book size={18} /> },
    { id: 'todo', label: '📝 To-Do Lists', icon: <CheckSquare size={18} /> },
    { id: 'planner', label: '🗓️ Weekly Planner', icon: <Calendar size={18} /> }
  ];

  // Calculate milestones
  const total = notes.length;
  const eveningCount = notes.filter(n => {
    if (!n || !n.created_at) return false;
    try {
      const hr = new Date(n.created_at).getHours();
      return !isNaN(hr) && hr >= 18;
    } catch (e) {
      return false;
    }
  }).length;
  const hasPinOrFav = notes.some(n => n && (n.is_pinned || n.is_favorite));

  const achievements = [
    { id: '10-notes', label: '🌸 Gathered 10+ thoughts', unlocked: total >= 10 },
    { id: '5-nights', label: '☁️ 5 Cozy evening scraps', unlocked: eveningCount >= 5 },
    { id: 'first-pin', label: '🎀 First pinned dream', unlocked: hasPinOrFav }
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div className="sidebar-logo">
          <span>🍒</span> NoteVerse
        </div>
        <button className="menu-toggle-btn" onClick={() => setIsOpen(false)}>
          <X size={24} />
        </button>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`sidebar-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => {
              setActivePage(item.id);
              setIsOpen(false);
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </li>
        ))}
      </ul>

      {/* Sidebar achievements block */}
      <div style={{ marginTop: '30px', padding: '12px 14px', border: '1.5px dashed var(--theme-dark)', borderRadius: '12px', background: 'rgba(255,255,255,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '10px' }}>
          <Award size={14} className="vinyl-icon" />
          <span>My Soft Milestones</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {achievements.map((ach) => (
            <div 
              key={ach.id} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                fontSize: '0.72rem', 
                opacity: ach.unlocked ? 1 : 0.5,
                fontWeight: 500
              }}
            >
              {ach.unlocked ? (
                <CheckCircle size={12} style={{ color: 'var(--theme-primary)' }} />
              ) : (
                <Circle size={12} />
              )}
              <span style={{ textDecoration: ach.unlocked ? 'none' : 'line-through' }}>{ach.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-profile">
        <div className="profile-info">
          <h4 style={{ fontSize: '0.82rem' }}>{userEmail || 'journaler@cherries.com'}</h4>
          <button onClick={onLogout} className="logout-btn">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <LogOut size={12} /> Sign out
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

