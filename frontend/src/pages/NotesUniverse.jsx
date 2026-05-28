import React from 'react';
import NotesGrid from '../components/NotesGrid';

const NOTE_MOODS = [
  { id: 'dreamy', emoji: '☁', label: 'dreamy' },
  { id: 'soft', emoji: '🎀', label: 'soft' },
  { id: 'nostalgic', emoji: '🌧', label: 'nostalgic' },
  { id: 'romantic', emoji: '🍓', label: 'romantic' },
  { id: 'chaotic', emoji: '⚡', label: 'chaotic' },
  { id: 'calm', emoji: '🌸', label: 'calm' },
  { id: 'anxious', emoji: '🌙', label: 'anxious' },
  { id: 'healing', emoji: '🕊', label: 'healing' },
  { id: 'motivated', emoji: '✨', label: 'motivated' }
];

export default function NotesUniverse({
  notes,
  filteredNotes,
  allTags,
  selectedTag,
  setSelectedTag,
  selectedMood,
  setSelectedMood,
  onEdit,
  onPinToggle,
  onFavoriteToggle,
  onDelete
}) {
  return (
    <div style={{ animation: 'modal-pop 0.3s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 className="cozy-twilight-espresso-heading" style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--theme-primary)', marginBottom: '4px' }}>
            📔 Notes Universe
          </h2>
          <p style={{ fontSize: '0.88rem', opacity: 0.8 }}>
            A beautiful galaxy of your late-night thoughts and cozy memories.
          </p>
        </div>
      </div>

      {/* Filters bar */}
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', flexWrap: 'wrap' }}>
        {/* Tag list */}
        {allTags.length > 0 && (
          <div className="tag-filters" style={{ margin: 0 }}>
            <span 
              className={`tag-pill ${!selectedTag ? 'active' : ''}`}
              onClick={() => setSelectedTag(null)}
            >
              All Tags ✨
            </span>
            {allTags.map((tag) => (
              <span
                key={tag}
                className={`tag-pill ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Mood filter chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.8 }}>Moods:</span>
          <button 
            onClick={() => setSelectedMood(null)}
            className={`tag-pill ${!selectedMood ? 'active' : ''}`}
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          >
            All
          </button>
          {NOTE_MOODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMood(m.id === selectedMood ? null : m.id)}
              className={`tag-pill ${selectedMood === m.id ? 'active' : ''}`}
              style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '3px' }}
            >
              <span>{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <NotesGrid
        notes={filteredNotes}
        onEdit={onEdit}
        onPinToggle={onPinToggle}
        onFavoriteToggle={onFavoriteToggle}
        onDelete={onDelete}
      />
    </div>
  );
}
