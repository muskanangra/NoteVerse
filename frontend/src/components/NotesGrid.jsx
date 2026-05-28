import React from 'react';
import NoteCard from './NoteCard';

const PLACEHOLDERS = [
  {
    id: 'placeholder-1',
    title: '🌸 songs that feel like pink sunsets',
    content: "1. 'Strawberry Fields Forever' - The Beatles<br/>2. 'Sunsetz' - Cigarettes After Sex<br/>3. 'Pink + White' - Frank Ocean",
    mood: 'dreamy',
    tags: ['music', 'playlist'],
    color_theme: 'pink',
    song_title: 'Pink + White — Frank Ocean',
    song_link: 'https://spotify.com',
    created_at: new Date().toISOString(),
    is_placeholder: true
  },
  {
    id: 'placeholder-2',
    title: '🏡 dream apartment ideas',
    content: "<ul><li>Scalloped rugs in pastel cream</li><li>Velvet cherry red vanity stool</li><li>Vintage gold mirror with lace drapes</li></ul>",
    mood: 'excited',
    tags: ['decor', 'future'],
    color_theme: 'lavender',
    created_at: new Date().toISOString(),
    is_placeholder: true
  },
  {
    id: 'placeholder-3',
    title: '🍒 things i want to romanticize',
    content: "<blockquote>\"To live is the rarest thing in the world. Most people exist, that is all.\"</blockquote><ul><li>Buying fresh berries from the market</li><li>Writing handwritten letters</li></ul>",
    mood: 'happy',
    tags: ['selfcare'],
    color_theme: 'cream',
    created_at: new Date().toISOString(),
    is_placeholder: true
  },
  {
    id: 'placeholder-4',
    title: '💭 your thoughts deserve a beautiful place to live...',
    content: "This is a cozy example card. Tap <b>'+ New Scrap'</b> in the top right to start logging your own gorgeous notes! These example inspiration blocks will disappear automatically as soon as you save your first memory.",
    mood: 'neutral',
    tags: ['onboarding'],
    color_theme: 'sage',
    created_at: new Date().toISOString(),
    is_placeholder: true
  }
];

export default function NotesGrid({ notes, onEdit, onPinToggle, onFavoriteToggle, onDelete }) {
  if (notes.length === 0) {
    return (
      <div style={{ marginTop: '72px', paddingTop: '32px', borderTop: '1px dashed rgba(78, 59, 62, 0.08)' }}>
        <h3 className="cozy-twilight-espresso-heading" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '24px', color: 'var(--theme-primary)' }}>
          <span className="decorative-icon" style={{ marginRight: '8px' }}>✨</span>Onboarding Inspiration
        </h3>
        <div className="masonry-grid">
          {PLACEHOLDERS.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={onEdit}
              onPinToggle={onPinToggle}
              onFavoriteToggle={onFavoriteToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    );
  }

  const pinnedNotes = notes.filter((n) => n.is_pinned);
  const unpinnedNotes = notes.filter((n) => !n.is_pinned);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {pinnedNotes.length > 0 && (
        <div style={{ background: 'rgba(255, 255, 255, 0.25)', border: '2px dashed var(--theme-dark)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📌 Pinned Memories
          </h3>
          <div className="masonry-grid">
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={onEdit}
                onPinToggle={onPinToggle}
                onFavoriteToggle={onFavoriteToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {unpinnedNotes.length > 0 && (
        <div>
          {pinnedNotes.length > 0 && (
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '16px' }}>
              📔 All Thoughts
            </h3>
          )}
          <div className="masonry-grid">
            {unpinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={onEdit}
                onPinToggle={onPinToggle}
                onFavoriteToggle={onFavoriteToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
