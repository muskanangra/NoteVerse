import React from 'react';
import { Pin, Heart, Trash2, Music } from 'lucide-react';

const MOOD_DETAILS = {
  dreamy: { emoji: '☁', label: 'dreamy', color: '#E8DFF5' },
  soft: { emoji: '🎀', label: 'soft', color: '#FFD5E0' },
  nostalgic: { emoji: '🌧', label: 'nostalgic', color: '#D6EADF' },
  romantic: { emoji: '🍓', label: 'romantic', color: '#FAD2E1' },
  chaotic: { emoji: '⚡', label: 'chaotic', color: '#FCF4DD' },
  calm: { emoji: '🌸', label: 'calm', color: '#FFF0F3' },
  anxious: { emoji: '🌙', label: 'anxious', color: '#F1ECE3' },
  healing: { emoji: '🕊', label: 'healing', color: '#E8F1F2' },
  motivated: { emoji: '✨', label: 'motivated', color: '#FCF4DD' },
  neutral: { emoji: '🧸', label: 'neutral', color: '#FFFDF9' }
};

export default function NoteCard({ note, onEdit, onPinToggle, onFavoriteToggle, onDelete }) {
  const formattedDate = new Date(note.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleCardClick = (e) => {
    if (note.is_placeholder) return;
    if (e.target.closest('.note-action-btn') || e.target.closest('.music-pill')) return;
    onEdit(note);
  };

  const moodInfo = MOOD_DETAILS[note.mood] || MOOD_DETAILS.neutral;

  return (
    <div 
      className={`note-card theme-${note.color_theme || 'cream'}`}
      onClick={handleCardClick}
      style={note.is_placeholder ? { opacity: 0.65, cursor: 'default' } : {}}
    >
      <div className="note-tape"></div>
      
      <div className="note-header">
        <span 
          className="note-mood-badge" 
          title={`Mood: ${note.mood}`}
          style={{ backgroundColor: moodInfo.color }}
        >
          {moodInfo.emoji}
        </span>
        
        {note.is_placeholder ? (
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--theme-primary)', background: 'rgba(255,255,255,0.5)', padding: '2px 8px', borderRadius: '10px' }}>
            Example ✨
          </span>
        ) : (
          <div className="note-actions">
            <button 
              className={`note-action-btn ${note.is_pinned ? 'active' : ''}`}
              onClick={() => onPinToggle(note)}
              title={note.is_pinned ? 'Unpin' : 'Pin'}
            >
              <Pin size={16} fill={note.is_pinned ? 'currentColor' : 'none'} />
            </button>
            <button 
              className={`note-action-btn ${note.is_favorite ? 'active' : ''}`}
              onClick={() => onFavoriteToggle(note)}
              title={note.is_favorite ? 'Unfavorite' : 'Favorite'}
            >
              <Heart size={16} fill={note.is_favorite ? 'currentColor' : 'none'} />
            </button>
            <button 
              className="note-action-btn"
              style={{ color: '#D23B4C' }}
              onClick={() => onDelete(note.id)}
              title="Throw Away"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      <h3 className="note-title">{note.title}</h3>

      {/* Polaroid Picture section */}
      {note.image_url && (
        <div className="polaroid-frame">
          <img src={note.image_url} alt="Polaroid Memory" className="polaroid-image" />
        </div>
      )}

      {/* Rich Content editor content */}
      <div 
        className="note-content rich-content" 
        dangerouslySetInnerHTML={{ __html: note.content || '' }}
      />

      {/* Music Pill attachment */}
      {note.song_title && (
        <a 
          href={note.song_link || '#'} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="music-pill"
          title="Attached Song"
        >
          <span className="vinyl-icon" style={{ display: 'inline-block' }}>💿</span>
          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {note.song_title}
          </span>
        </a>
      )}

      <div className="note-footer">
        <div className="note-tags">
          {(note.tags || []).map((tag, idx) => (
            <span key={idx} className="note-tag">#{tag}</span>
          ))}
        </div>
        <span>{formattedDate}</span>
      </div>
    </div>
  );
}
