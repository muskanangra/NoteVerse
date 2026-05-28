import React, { useState, useRef } from 'react';
import { X, Bold, Italic, Underline, List, Quote, Upload, Music } from 'lucide-react';

const COLORS = [
  { name: 'pink', value: '#FFD5E0' },
  { name: 'lavender', value: '#E8DFF5' },
  { name: 'sage', value: '#D6EADF' },
  { name: 'cream', value: '#FFFDF9' },
  { name: 'yellow', value: '#FCF4DD' },
  { name: 'peach', value: '#FAD2E1' }
];

const MOODS = [
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

export default function CreateNoteModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('neutral');
  const [tagsInput, setTagsInput] = useState('');
  const [colorTheme, setColorTheme] = useState('cream');

  // New features state
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [songLink, setSongLink] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const editorRef = useRef(null);

  if (!isOpen) return null;

  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('cherry_notes_token');
      const res = await fetch('http://127.0.0.1:8000/api/notes/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setImageUrl(data.image_url);
    } catch (err) {
      alert('Failed to upload image: ' + err.message);
      setImagePreview('');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    onSubmit({
      title,
      content,
      mood,
      tags,
      color_theme: colorTheme,
      image_url: imageUrl || null,
      song_title: songTitle || null,
      song_link: songLink || null,
      is_pinned: false,
      is_favorite: false
    });

    // Reset fields
    setTitle('');
    setContent('');
    setMood('neutral');
    setTagsInput('');
    setColorTheme('cream');
    setImageUrl('');
    setImagePreview('');
    setSongTitle('');
    setSongLink('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>✍️ Capture a Memory</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="songs that feel like warm matcha"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Mood chips selector */}
          <div className="form-group">
            <label>How does this memory feel?</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
              {MOIDS_ARRAY_MAPPED()}
            </div>
          </div>

          {/* Rich Text Editor */}
          <div className="form-group">
            <label>Your thoughts</label>
            <div style={{ border: 'var(--handdrawn-border)', borderRadius: '12px', background: '#FFFDF9', overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: '6px', background: 'var(--theme-accent-light, #FFF0F3)', padding: '8px', borderBottom: '2px solid var(--theme-dark)' }}>
                <button type="button" onClick={() => handleFormat('bold')} style={btnStyle}><Bold size={15} /></button>
                <button type="button" onClick={() => handleFormat('italic')} style={btnStyle}><Italic size={15} /></button>
                <button type="button" onClick={() => handleFormat('underline')} style={btnStyle}><Underline size={15} /></button>
                <button type="button" onClick={() => handleFormat('insertUnorderedList')} style={btnStyle}><List size={15} /></button>
                <button type="button" onClick={() => handleFormat('formatBlock', 'blockquote')} style={btnStyle}><Quote size={15} /></button>
              </div>
              <div
                ref={editorRef}
                contentEditable
                placeholder="Start typing..."
                onBlur={(e) => setContent(e.currentTarget.innerHTML)}
                style={{
                  minHeight: '150px',
                  maxHeight: '250px',
                  padding: '14px',
                  outline: 'none',
                  overflowY: 'auto',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.98rem'
                }}
              />
            </div>
          </div>

          {/* Polaroid Image upload */}
          <div className="form-group">
            <label>Attach Polaroid Image</label>
            <div 
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                border: '2px dashed var(--theme-dark)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: dragOver ? 'var(--theme-accent-light)' : '#FFFDF9',
                cursor: 'pointer',
                position: 'relative'
              }}
              onClick={() => document.getElementById('note-file-input').click()}
            >
              <input 
                id="note-file-input" 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
              />
              {imagePreview ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <img src={imagePreview} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: 'var(--handdrawn-border)' }} />
                  <span style={{ fontSize: '0.8rem', color: 'green' }}>{uploading ? 'Uploading...' : 'Attached! ✨'}</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <Upload size={20} style={{ color: 'var(--theme-primary)' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Drag & Drop or Click to Upload Polaroid</span>
                </div>
              )}
            </div>
          </div>

          {/* Music fields */}
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
              <label>Song Title</label>
              <div style={{ position: 'relative' }}>
                <Music size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--theme-primary)' }} />
                <input
                  type="text"
                  placeholder="e.g. cardigan - taylor swift"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  style={{ paddingLeft: '32px', width: '100%' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
              <label>Song Link (Optional)</label>
              <input
                type="url"
                placeholder="Spotify/YouTube URL"
                value={songLink}
                onChange={(e) => setSongLink(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Tags (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. selfcare, diary"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Paper Theme</label>
              <div className="theme-selector" style={{ marginTop: '8px' }}>
                {COLORS.map((c) => (
                  <div
                    key={c.name}
                    className={`color-option ${colorTheme === c.name ? 'selected' : ''}`}
                    style={{ backgroundColor: c.value, border: colorTheme === c.name ? '2px solid var(--theme-dark)' : '1px solid rgba(0,0,0,0.1)' }}
                    onClick={() => setColorTheme(c.name)}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cute-btn cute-btn-secondary" style={{ padding: '8px 16px' }}>
              Cancel
            </button>
            <button type="submit" className="cute-btn" style={{ padding: '8px 20px' }}>
              Save to Journal 🍒
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  function MOIDS_ARRAY_MAPPED() {
    return MOODS.map((m) => (
      <button
        key={m.id}
        type="button"
        onClick={() => setMood(m.id)}
        style={{
          padding: '6px 12px',
          borderRadius: '20px',
          border: 'var(--handdrawn-border)',
          backgroundColor: mood === m.id ? 'var(--theme-primary)' : '#FFFDF9',
          color: mood === m.id ? '#FFFDF9' : 'var(--theme-dark)',
          fontSize: '0.82rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          transform: mood === m.id ? 'rotate(-2deg)' : 'none',
          boxShadow: mood === m.id ? '2px 2px 0px var(--theme-dark)' : 'none',
          transition: 'all 0.15s'
        }}
      >
        <span>{m.emoji}</span>
        <span>{m.label}</span>
      </button>
    ));
  }
}

const btnStyle = {
  border: '1px solid var(--theme-dark)',
  background: '#FFFDF9',
  padding: '6px',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '1px 1px 0px var(--theme-dark)'
};
