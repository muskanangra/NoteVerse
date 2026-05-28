import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import NotesUniverse from './NotesUniverse';
import TodoListPage from './TodoListPage';
import WeeklyPlannerPage from './WeeklyPlannerPage';
import CreateNoteModal from '../components/CreateNoteModal';
import EditNoteModal from '../components/EditNoteModal';
import { notesApi } from '../api/notesApi';
import { Palette, Volume2, VolumeX, RefreshCw, Lock, Award, Settings, CheckCircle, Home, CheckSquare, Calendar, Book } from 'lucide-react';
import '../styles/dashboard.css';

const THEMES = [
  { id: 'cherry-cream', label: '🍒 Cherry Cream', color: '#D23B4C', bg: '#FFFDF9' },
  { id: 'lavender-dreams', label: '🔮 Lavender Dreams', color: '#7251B5', bg: '#FAF9FE' },
  { id: 'strawberry-milk', label: '🍓 Strawberry Milk', color: '#E05275', bg: '#FFF5F7' },
  { id: 'matcha-morning', label: '🍵 Matcha Morning', color: '#556B2F', bg: '#F8F9F5' },
  { id: 'rose-diary', label: '🌹 Rose Diary', color: '#CD6A7C', bg: '#FAF4EF' },
  { id: 'cozy-twilight', label: '🌇 Cozy Twilight', color: '#CD6A7C', bg: '#2D1A1E' }
];

const DASHBOARD_MOODS = [
  { id: 'dreamy', emoji: '☁', label: 'dreamy' },
  { id: 'soft', emoji: '🎀', label: 'soft' },
  { id: 'nostalgic', emoji: '🌧', label: 'nostalgic' },
  { id: 'romantic', emoji: '🍓', label: 'romantic' },
  { id: 'calm', emoji: '🌸', label: 'calm' },
  { id: 'motivated', emoji: '✨', label: 'motivated' }
];

const MOOD_PLAYLISTS = {
  dreamy: [
    { name: '🎹 Peaceful Piano', link: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO' },
    { name: '☁️ Soft Dreamy Indie', link: 'https://open.spotify.com/playlist/37i9dQZF1DX6V47NuzV86l' }
  ],
  soft: [
    { name: '🎀 Soft Pop Hits', link: 'https://open.spotify.com/playlist/37i9dQZF1DX4T5J3ZJCcBu' },
    { name: '🍭 Sweet Acoustic Cafe', link: 'https://open.spotify.com/playlist/37i9dQZF1DXaImTe2cxJ7g' }
  ],
  nostalgic: [
    { name: '🌧️ Lofi Beats', link: 'https://open.spotify.com/playlist/37i9dQZF1DX8U9a9as29a' },
    { name: '📻 Oldies But Goodies', link: 'https://open.spotify.com/playlist/37i9dQZF1DX11GHf2wT5R4' }
  ],
  romantic: [
    { name: '🍓 Vintage Love Songs', link: 'https://open.spotify.com/playlist/37i9dQZF1DX7Kbqq1tU0Q6' },
    { name: '🎷 Cozy Soft Jazz', link: 'https://open.spotify.com/playlist/37i9dQZF1DWV7EzJMK2FNS' }
  ],
  calm: [
    { name: '🌸 Calm Lofi Books', link: 'https://open.spotify.com/playlist/37i9dQZF1DX1s9knjP51Oa' },
    { name: '🧘 Nature Sounds Calm', link: 'https://open.spotify.com/playlist/37i9dQZF1DX4PP3TTFJ4jQ' }
  ],
  motivated: [
    { name: '✨ Deep Focus Study', link: 'https://open.spotify.com/playlist/37i9dQZF1DX8NTLI2tH6t2' },
    { name: '🥁 Motivating Beats', link: 'https://open.spotify.com/playlist/37i9dQZF1DX325t6gI810q' }
  ]
};


const PROMPTS = [
  "what felt soft today?",
  "what are you slowly becoming?",
  "describe today like a movie scene.",
  "what made you feel alive recently?",
  "what kind of softness do you need today?",
  "what memory would you frame forever?",
  "what songs feel like your current life?",
  "what little thing made today sweeter?",
  "what color feels like your soul today?",
  "what deserves more gratitude lately?",
  "what emotion has been visiting you lately?",
  "what kind of future are you quietly building?",
  "what feels like home right now?",
  "what tiny joy deserves remembering?"
];

const STICKER_PALETTE = ['🍒', '🎀', '✨', '🌸', '🍓', '🧸', '☁️', '💖', '🍭', '⭐', '🎈', '🕊️'];

export default function Dashboard({ onLogout }) {
  const [notes, setNotes] = useState([]);
  const [activePage, setActivePage] = useState('hub'); // hub, notes, todo, planner
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  
  // Customization Themes
  const [activeTheme, setActiveTheme] = useState('cherry-cream');
  const [accentColor, setAccentColor] = useState('#D23B4C');
  const [fontPairing, setFontPairing] = useState('serif');
  const [bgStyle, setBgStyle] = useState('grid');
  const [skyOverride, setSkyOverride] = useState('auto');
  const [isPersonalizationOpen, setIsPersonalizationOpen] = useState(false);

  // Modals visibility
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // FEATURE 1: Mood-Reactive State
  const [dashboardMood, setDashboardMood] = useState(() => {
    return localStorage.getItem('cherry_notes_dashboard_mood') || 'calm';
  });

  // FEATURE 3: Music Player State (Aesthetic Spotify Vinyl Corner with Rain Ambient Layer)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [ambientSound, setAmbientSound] = useState('piano');
  const [musicVolume, setMusicVolume] = useState(0.4);
  const audioRef = useRef(null);

  const [spotifyLink, setSpotifyLink] = useState(() => {
    return localStorage.getItem('cherry_notes_spotify_link') || 'https://open.spotify.com/playlist/37i9dQZF1DX8U9a9as29a';
  });
  const [spotifyInput, setSpotifyInput] = useState('');
  const [customPlaylists, setCustomPlaylists] = useState(() => {
    try {
      const saved = localStorage.getItem('cherry_notes_custom_playlists');
      return saved ? JSON.parse(saved) : [
        { name: '☕ Cozy Rainy Lofi', link: 'https://open.spotify.com/playlist/37i9dQZF1DX8U9a9as29a' },
        { name: '🎹 Soft Dreamy Piano', link: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO' },
        { name: '🍓 Vintage Love Songs', link: 'https://open.spotify.com/playlist/37i9dQZF1DX7Kbqq1tU0Q6' }
      ];
    } catch (e) {
      return [];
    }
  });
  const [isMusicCollapsed, setIsMusicCollapsed] = useState(false);
  const [isMusicMinimized, setIsMusicMinimized] = useState(false);
  const [isRainOverlayActive, setIsRainOverlayActive] = useState(false);

  const getSpotifyEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('/embed/')) return url;
    const regex = /spotify\.com\/(track|playlist|album)\/([a-zA-Z0-9]+)/;
    const match = url.match(regex);
    if (match) {
      const [, type, id] = match;
      return `https://open.spotify.com/embed/${type}/${id}`;
    }
    return '';
  };

  const handleSavePlaylist = (name, link) => {
    if (!name || !link) return;
    const updated = [...customPlaylists, { name, link }];
    setCustomPlaylists(updated);
    localStorage.setItem('cherry_notes_custom_playlists', JSON.stringify(updated));
    showToast('added to your vinyl desk collection! 💿');
  };

  const handleRemovePlaylist = (idx) => {
    const updated = customPlaylists.filter((_, i) => i !== idx);
    setCustomPlaylists(updated);
    localStorage.setItem('cherry_notes_custom_playlists', JSON.stringify(updated));
    showToast('removed playlist from desk collection.');
  };


  // FEATURE 4: Daily Prompts State
  const [currentPrompt, setCurrentPrompt] = useState('');

  // FEATURE 6: Sticker System State
  const [stickers, setStickers] = useState(() => {
    try {
      const saved = localStorage.getItem('cherry_notes_stickers');
      return saved ? JSON.parse(saved) : [
        { id: 1, emoji: '🍒', x: 230, y: 150, scale: 1.1, rotate: -5 },
        { id: 2, emoji: '🎀', x: 820, y: 80, scale: 1.0, rotate: 12 },
        { id: 3, emoji: '✨', x: 440, y: 190, scale: 1.2, rotate: 15 }
      ];
    } catch (e) {
      return [
        { id: 1, emoji: '🍒', x: 230, y: 150, scale: 1.1, rotate: -5 },
        { id: 2, emoji: '🎀', x: 820, y: 80, scale: 1.0, rotate: 12 },
        { id: 3, emoji: '✨', x: 440, y: 190, scale: 1.2, rotate: 15 }
      ];
    }
  });

  // FEATURE 8: Memory Jar State
  const [jarShaking, setJarShaking] = useState(false);
  const [memoryJarOpen, setMemoryJarOpen] = useState(false);
  const [randomMemory, setRandomMemory] = useState(null);

  // FEATURE 9: Aesthetic Notifications State
  const [toasts, setToasts] = useState([]);

  // Time based Sky class calculator
  const [skyClass, setSkyClass] = useState('sky-afternoon');

  const showToast = (message) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // Soundhelix MP3 Streams
  const ambientTracks = {
    rain: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    piano: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    crackle: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    night: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    lofi: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    harp: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    matcha: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    lavender: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
  };

  // Load Notes
  const loadNotes = async () => {
    try {
      const data = await notesApi.getNotes();
      setNotes(data);
    } catch (err) {
      console.error(err);
      onLogout();
    }
  };

  // Setup hooks
  useEffect(() => {
    loadNotes();

    const token = localStorage.getItem('cherry_notes_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserEmail(payload.email || '');
      } catch (e) {
        setUserEmail('');
      }
    }

    // Load customizations
    const savedTheme = localStorage.getItem('cherry_notes_theme');
    if (savedTheme) setActiveTheme(savedTheme);
    const savedAccent = localStorage.getItem('cherry_notes_accent');
    if (savedAccent) setAccentColor(savedAccent);
    const savedFont = localStorage.getItem('cherry_notes_font');
    if (savedFont) setFontPairing(savedFont);
    const savedBg = localStorage.getItem('cherry_notes_bg');
    if (savedBg) setBgStyle(savedBg);
    const savedSky = localStorage.getItem('cherry_notes_sky');
    if (savedSky) setSkyOverride(savedSky);

    rotatePrompt();
  }, []);

  // Sky lighting updates
  useEffect(() => {
    if (skyOverride !== 'auto') {
      setSkyClass(`sky-${skyOverride}`);
      return;
    }

    const updateSky = () => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 12) setSkyClass('sky-morning');
      else if (hour >= 12 && hour < 17) setSkyClass('sky-golden');
      else if (hour >= 17 && hour < 21) setSkyClass('sky-twilight');
      else setSkyClass('sky-moonlight');
    };

    updateSky();
    const interval = setInterval(updateSky, 60000);
    return () => clearInterval(interval);
  }, [skyOverride]);

  // Audio Playback for ambient rain/crackle overlay
  useEffect(() => {
    if (isRainOverlayActive) {
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(ambientTracks[ambientSound]);
      audioRef.current.loop = true;
      audioRef.current.volume = musicVolume;
      audioRef.current.play().catch(err => {
        console.warn("Playback blocked.", err);
        setIsRainOverlayActive(false);
      });
    } else {
      if (audioRef.current) audioRef.current.pause();
    }
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, [isRainOverlayActive, ambientSound]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = musicVolume;
  }, [musicVolume]);

  const handleThemeChange = (themeId) => {
    setActiveTheme(themeId);
    localStorage.setItem('cherry_notes_theme', themeId);
    showToast(`theme switched to ${themeId.replace('-', ' ')} ✨`);
  };

  const handleCustomizationSave = (key, value, setter) => {
    setter(value);
    localStorage.setItem(`cherry_notes_${key}`, value);
  };

  // CRUD actions
  const handleCreateNote = async (noteData) => {
    try {
      await notesApi.createNote(noteData);
      loadNotes();
      showToast("your little thoughts have been safely saved ♡");
    } catch (err) {
      showToast("error saving your scrap 🎀");
    }
  };

  const handleUpdateNote = async (noteId, noteData) => {
    try {
      await notesApi.updateNote(noteId, noteData);
      loadNotes();
      showToast("another soft memory captured.");
    } catch (err) {
      showToast("failed to update memory.");
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('🌸 Are you sure you want to throw this memory into the recycle bin?')) {
      try {
        await notesApi.deleteNote(noteId);
        loadNotes();
        showToast("your memory has been cast away 🗑️");
      } catch (err) {
        showToast("could not delete memory.");
      }
    }
  };

  const handlePinToggle = async (note) => {
    await handleUpdateNote(note.id, { is_pinned: !note.is_pinned });
  };

  const handleFavoriteToggle = async (note) => {
    await handleUpdateNote(note.id, { is_favorite: !note.is_favorite });
  };

  // Filter notes
  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags || [])));
  const filteredNotes = notes.filter((note) => {
    if (selectedTag && !(note.tags || []).includes(selectedTag)) return false;
    if (selectedMood && note.mood !== selectedMood) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = (note.title || '').toLowerCase().includes(q);
      const contentMatch = (note.content || '').toLowerCase().includes(q);
      const moodMatch = (note.mood || '').toLowerCase().includes(q);
      const tagMatch = (note.tags || []).some(t => t.toLowerCase().includes(q));
      return titleMatch || contentMatch || moodMatch || tagMatch;
    }

    return true;
  });

  // FEATURE 1: Mood Change handler
  const handleMoodSelect = (moodId) => {
    setDashboardMood(moodId);
    localStorage.setItem('cherry_notes_dashboard_mood', moodId);
    showToast(`mood shifted to ${moodId}... enjoy the ambient scenery ☁️`);
  };

  // FEATURE 4: Daily prompts rotation
  const rotatePrompt = () => {
    const randomIdx = Math.floor(Math.random() * PROMPTS.length);
    setCurrentPrompt(PROMPTS[randomIdx]);
  };

  // FEATURE 6: Draggable Stickers placement
  const addSticker = (emoji) => {
    const newSticker = {
      id: Date.now(),
      emoji,
      x: window.innerWidth / 2 - 40,
      y: window.innerHeight / 2 - 40,
      scale: 1,
      rotate: 0
    };
    const updated = [...stickers, newSticker];
    setStickers(updated);
    localStorage.setItem('cherry_notes_stickers', JSON.stringify(updated));
    showToast(`placed a cute ${emoji} sticker on your desk 🎀`);
  };

  const handleStickerDragStart = (e, stickerId) => {
    e.preventDefault();
    const isTouch = e.type.startsWith('touch');
    const startX = isTouch ? e.touches[0].clientX : e.clientX;
    const startY = isTouch ? e.touches[0].clientY : e.clientY;
    
    const sticker = stickers.find(s => s.id === stickerId);
    if (!sticker) return;
    
    const initialX = sticker.x;
    const initialY = sticker.y;

    const handleMouseMove = (moveEvent) => {
      const moveTouch = moveEvent.type.startsWith('touch');
      const currentX = moveTouch ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const currentY = moveTouch ? moveEvent.touches[0].clientY : moveEvent.clientY;
      
      const dx = currentX - startX;
      const dy = currentY - startY;
      
      setStickers(prev => prev.map(s => {
        if (s.id === stickerId) return { ...s, x: initialX + dx, y: initialY + dy };
        return s;
      }));
    };
    
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      
      setStickers(prev => {
        localStorage.setItem('cherry_notes_stickers', JSON.stringify(prev));
        return prev;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);
  };

  const adjustSticker = (id, action) => {
    setStickers(prev => {
      const updated = prev.map(s => {
        if (s.id === id) {
          if (action === 'grow') return { ...s, scale: Math.min(s.scale + 0.1, 2) };
          if (action === 'shrink') return { ...s, scale: Math.max(s.scale - 0.1, 0.5) };
          if (action === 'rotate') return { ...s, rotate: (s.rotate + 15) % 360 };
        }
        return s;
      });
      localStorage.setItem('cherry_notes_stickers', JSON.stringify(updated));
      return updated;
    });
  };

  const removeSticker = (id) => {
    const updated = stickers.filter(s => s.id !== id);
    setStickers(updated);
    localStorage.setItem('cherry_notes_stickers', JSON.stringify(updated));
  };

  // FEATURE 8: Memory Jar trigger
  const handleMemoryJarClick = () => {
    if (notes.length === 0) {
      showToast("your memory jar is empty... write your first thoughts! ♡");
      return;
    }
    setJarShaking(true);
    setTimeout(() => {
      setJarShaking(false);
      const randomIdx = Math.floor(Math.random() * notes.length);
      setRandomMemory(notes[randomIdx]);
      setMemoryJarOpen(true);
      showToast("a sweet nostalgic scrap floats to the top ✨");
    }, 600);
  };

  // FEATURE 12: Soft Achievement System calculation
  const getAchievements = () => {
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

    return [
      { id: '10-memories', emoji: '🌸', title: 'captured 10 little memories', unlocked: total >= 10 },
      { id: '5-evenings', emoji: '☁', title: 'wrote during 5 rainy evenings', unlocked: eveningCount >= 5 },
      { id: 'dream-board', emoji: '🎀', title: 'completed first dream board', unlocked: hasPinOrFav }
    ];
  };

  // Render sub page views dynamically
  const renderSubPage = () => {
    switch (activePage) {
      case 'notes':
        return (
          <NotesUniverse
            notes={notes}
            filteredNotes={filteredNotes}
            allTags={allTags}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            selectedMood={selectedMood}
            setSelectedMood={setSelectedMood}
            onEdit={(note) => {
              setSelectedNote(note);
              setIsEditOpen(true);
            }}
            onPinToggle={handlePinToggle}
            onFavoriteToggle={handleFavoriteToggle}
            onDelete={handleDeleteNote}
          />
        );
      case 'todo':
        return <TodoListPage showToast={showToast} />;
      case 'planner':
        return <WeeklyPlannerPage showToast={showToast} />;
      case 'hub':
      default:
        return renderFeatureHub();
    }
  };

  // Render Hub Home Page view
  const renderFeatureHub = () => {
    const totalNotes = notes.length;
    const pinnedCount = notes.filter(n => n.is_pinned).length;

    return (
      <div style={{ animation: 'modal-pop 0.3s ease-out' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '30px' }}>
          <h2 className="cozy-twilight-espresso-heading" style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--theme-primary)' }}>
            🏠 Digital Scrapbook Hub
          </h2>
          <p style={{ fontSize: '0.9rem', opacity: 0.8, color: (skyClass === 'sky-twilight' || skyClass === 'sky-moonlight') ? '#f7ede7' : 'var(--theme-dark)' }}>
            Welcome to your digital desk setup. Tap cards to open your journal drawers.
          </p>
        </div>

        {/* Feature cards grids with hover rotations & tilts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', position: 'relative', zIndex: 10 }}>
          
          {/* Notes Universe Card */}
          <div 
            onClick={() => setActivePage('notes')}
            className="scrapbook-widget-card"
            style={{ cursor: 'pointer', transform: 'rotate(-1deg)', background: '#fffaf8', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px' }}
          >
            <div className="note-tape" style={{ left: '25%', width: '50%' }}></div>
            <div>
              <h4 className="scrapbook-widget-title" style={{ marginTop: '10px' }}>📔 Notes Universe</h4>
              <p style={{ fontSize: '0.82rem', opacity: 0.85, marginTop: '6px' }}>
                Browse your collection of Polaroid memory cards, search thoughts, and write new scraps.
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', borderTop: '1px dashed rgba(0,0,0,0.08)', paddingTop: '10px', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>📄 {totalNotes} scraps saved</span>
              <span>📌 {pinnedCount} pinned</span>
            </div>
          </div>

          {/* To-Do lists card */}
          <div 
            onClick={() => setActivePage('todo')}
            className="scrapbook-widget-card"
            style={{ cursor: 'pointer', transform: 'rotate(1.5deg)', background: '#fff7f9', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px' }}
          >
            <div className="note-tape" style={{ left: '30%', width: '40%', background: 'rgba(255,255,255,0.45)' }}></div>
            <div>
              <h4 className="scrapbook-widget-title" style={{ marginTop: '10px' }}>📝 Sticky To-Do Lists</h4>
              <p style={{ fontSize: '0.82rem', opacity: 0.85, marginTop: '6px' }}>
                Log self-care habits, task lists, school deadlines, and creative goals on sticky notes.
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', borderTop: '1px dashed rgba(0,0,0,0.08)', paddingTop: '10px', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>🌸 Tiny progress every day</span>
              <span style={{ color: 'var(--theme-primary)' }}>Manage checkmarks →</span>
            </div>
          </div>

          {/* Weekly Planner Card */}
          <div 
            onClick={() => setActivePage('planner')}
            className="scrapbook-widget-card"
            style={{ cursor: 'pointer', transform: 'rotate(-0.5deg)', background: '#fef6f3', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px' }}
          >
            <div className="note-tape" style={{ left: '35%', width: '30%' }}></div>
            <div>
              <h4 className="scrapbook-widget-title" style={{ marginTop: '10px' }}>🗓️ Weekly Calendar Desk</h4>
              <p style={{ fontSize: '0.82rem', opacity: 0.85, marginTop: '6px' }}>
                Schedule days from Monday to Sunday, track daily habits, and organize reminders.
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', borderTop: '1px dashed rgba(0,0,0,0.08)', paddingTop: '10px', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>📅 Habit Garden & Timetable</span>
              <span style={{ color: 'var(--theme-primary)' }}>Open Planner →</span>
            </div>
          </div>

          {/* Memory Jar Widget integrated inline */}
          <div className="scrapbook-widget-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '140px', padding: '12px 16px' }}>
            <h4 className="scrapbook-widget-title" style={{ width: '100%', marginBottom: '4px', paddingBottom: '4px', fontSize: '1rem' }}>🔮 Memory Jar</h4>
            <div className="memory-jar-container" style={{ minHeight: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onClick={handleMemoryJarClick}>
              <div className={`memory-jar-jar ${jarShaking ? 'shaking' : ''}`} style={{ fontSize: '4.2rem', lineHeight: 1 }}>🫙</div>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.8, marginTop: '4px', textAlign: 'center' }}>
                Click to extract a random memory scrap
              </span>
            </div>
          </div>

          {/* UPGRADED: Spotify Powered Vinyl Music Corner - Horizontal layout */}
          <div className="scrapbook-widget-card horizontal-music-corner" style={{ 
            minHeight: '220px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            background: '#fffcf7',
            borderColor: 'var(--theme-border-color)'
          }}>
            <div>
              <h4 className="scrapbook-widget-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>🎵 Cozy Luxury Vinyl Station</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => setIsMusicCollapsed(!isMusicCollapsed)} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', opacity: 0.7 }}
                    title={isMusicCollapsed ? "Expand player" : "Collapse player"}
                  >
                    {isMusicCollapsed ? '➕' : '➖'}
                  </button>
                  <button 
                    onClick={() => setIsMusicMinimized(true)} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', opacity: 0.7 }}
                    title="Minimize to floating vinyl"
                  >
                    🪟
                  </button>
                </div>
              </h4>

              {isMusicMinimized ? (
                <div style={{ textAlign: 'center', padding: '20px 0', fontSize: '0.8rem', fontStyle: 'italic', opacity: 0.8 }}>
                  Turntable is floating on your desk! Click the floating record on the screen to restore. 🌸
                </div>
              ) : (
                <div className="music-horizontal-container" style={{ display: 'flex', gap: '24px', marginTop: '10px' }}>
                  {/* LEFT SIDE: Turntable deck with interactive vinyl */}
                  <div className="turntable-left-pane" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.45)', borderRadius: '16px', padding: '12px', border: '1px dashed var(--theme-border-color)', position: 'relative' }}>
                    <div className="note-tape" style={{ top: '-10px', left: '30%', width: '40%', background: 'rgba(255,255,255,0.5)' }}></div>
                    <div 
                      className={`turntable-deck ${isMusicPlaying ? 'active' : ''}`}
                      onClick={() => setIsMusicPlaying(!isMusicPlaying)}
                      title={isMusicPlaying ? "Pause turntable spin" : "Spin record"}
                      style={{ cursor: 'pointer', position: 'relative' }}
                    >
                      <div className={`cherry-vinyl ${isMusicPlaying ? 'spinning' : ''}`}>
                        <div className="vinyl-grooves"></div>
                        <div className="vinyl-reflection"></div>
                        <div className="vinyl-label-center">
                          <span style={{ fontSize: '10px' }}>🌸</span>
                        </div>
                      </div>
                      <div className="turntable-stylus"></div>
                      
                      {isMusicPlaying && (
                        <div className="sparkles-container">
                          <div className="sparkle-star star-1">⭐</div>
                          <div className="sparkle-star star-2">✨</div>
                          <div className="sparkle-star star-3">🌸</div>
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: '0.68rem', fontStyle: 'italic', fontWeight: 600, marginTop: '8px', opacity: 0.8 }}>
                      {isMusicPlaying ? '💿 spinning...' : '⏸️ click to spin'}
                    </span>
                  </div>

                  {/* RIGHT SIDE: Spotify Embed & Playback Controls */}
                  <div className="turntable-right-pane" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {!isMusicCollapsed && (
                      <>
                        {/* Pasted Spotify Embed Frame */}
                        {getSpotifyEmbedUrl(spotifyLink) ? (
                          <div className="spotify-embed-frame" style={{ margin: 0, padding: '4px' }}>
                            <div style={{ fontSize: '0.65rem', fontStyle: 'italic', opacity: 0.8, marginBottom: '4px', textAlign: 'center', color: 'var(--theme-dark)' }}>
                              ✨ Click play inside the Spotify widget, then spin record!
                            </div>
                            <iframe 
                              src={getSpotifyEmbedUrl(spotifyLink)} 
                              width="100%" 
                              height="152" 
                              frameBorder="0" 
                              allowtransparency="true" 
                              allow="encrypted-media"
                              title="Spotify Player"
                              style={{ borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', minHeight: '152px', background: 'transparent' }}
                            ></iframe>
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.75rem', color: 'red', textAlign: 'center', margin: '4px 0' }}>
                            Invalid Spotify URL format.
                          </div>
                        )}

                        {/* URL Pasting Box */}
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input 
                            type="text" 
                            placeholder="Paste Spotify link... 🔗" 
                            value={spotifyInput} 
                            onChange={(e) => setSpotifyInput(e.target.value)}
                            style={{ flex: 1, fontSize: '0.75rem', padding: '6px 10px', borderRadius: '8px', border: '1px dashed var(--theme-border-color)', background: '#fffaf8' }}
                          />
                          <button 
                            onClick={() => {
                              if (spotifyInput.trim()) {
                                const parsed = getSpotifyEmbedUrl(spotifyInput);
                                if (parsed) {
                                  setSpotifyLink(spotifyInput);
                                  localStorage.setItem('cherry_notes_spotify_link', spotifyInput);
                                  handleSavePlaylist(`🎵 Added Track/Playlist #${customPlaylists.length + 1}`, spotifyInput);
                                  setSpotifyInput('');
                                } else {
                                  showToast('please enter a valid Spotify track/playlist link!');
                                }
                              }
                            }}
                            className="tag-pill" 
                            style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                          >
                            Tweak
                          </button>
                        </div>

                        {/* Dropdown switch saved collections */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <label style={{ fontSize: '0.7rem', fontWeight: 600, whiteSpace: 'nowrap', opacity: 0.8 }}>💿 Playlist:</label>
                          <select 
                            value={spotifyLink}
                            onChange={(e) => {
                              setSpotifyLink(e.target.value);
                              localStorage.setItem('cherry_notes_spotify_link', e.target.value);
                              showToast('vinyl collection changed! 💿');
                            }}
                            style={{ flex: 1, fontSize: '0.75rem', padding: '4px 6px', borderRadius: '8px', border: '1px solid var(--theme-border-color)', background: '#fffaf8' }}
                          >
                            {customPlaylists.map((p, idx) => (
                              <option key={idx} value={p.link}>{p.name}</option>
                            ))}
                          </select>
                        </div>

                        {/* Mood-responsive Playlist suggestion row */}
                        <div style={{ borderTop: '1px dashed rgba(0,0,0,0.08)', paddingTop: '6px' }}>
                          <label style={{ fontSize: '0.7rem', fontWeight: 600, display: 'block', color: 'var(--theme-primary)', marginBottom: '3px' }}>☁️ Suggested for {dashboardMood} mood:</label>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {(MOOD_PLAYLISTS[dashboardMood] || []).map((p, idx) => (
                              <button 
                                key={idx}
                                onClick={() => {
                                  setSpotifyLink(p.link);
                                  localStorage.setItem('cherry_notes_spotify_link', p.link);
                                  showToast(`tuned in to ${p.name}! ✨`);
                                }}
                                className="tag-pill"
                                style={{ padding: '2px 6px', fontSize: '0.65rem', background: '#fffaf8' }}
                              >
                                {p.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Background Atmospheric Layer Selector */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px dashed rgba(0,0,0,0.08)', paddingTop: '6px', fontSize: '0.7rem' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: 500 }}>
                            <input 
                              type="checkbox" 
                              checked={isRainOverlayActive} 
                              onChange={(e) => {
                                setIsRainOverlayActive(e.target.checked);
                                if (e.target.checked) {
                                  showToast('activated ambient sound layer! 🌧️');
                                }
                              }} 
                              style={{ accentColor: 'var(--theme-primary)' }}
                            />
                            Atmosphere Layer
                          </label>
                          {isRainOverlayActive && (
                            <>
                              <select 
                                value={ambientSound} 
                                onChange={(e) => setAmbientSound(e.target.value)}
                                style={{ padding: '2px 4px', fontSize: '0.7rem', border: '1px solid var(--theme-border-color)', borderRadius: '6px', background: '#fffaf8' }}
                              >
                                <option value="rain">🌧️ Rain</option>
                                <option value="crackle">📻 Crackle</option>
                                <option value="piano">🎹 Piano</option>
                                <option value="lofi">🌸 Lofi</option>
                              </select>
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={musicVolume}
                                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                                style={{ width: '50px', accentColor: 'var(--theme-primary)' }}
                              />
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div style={{ fontSize: '0.72rem', fontStyle: 'italic', borderTop: '1px dashed rgba(0,0,0,0.08)', paddingTop: '8px', opacity: 0.8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <span>Turntable status:</span>
              <span style={{ fontWeight: 600, color: 'var(--theme-primary)' }}>{isMusicPlaying ? 'Spinning 💿' : 'Stationary ⏸️'}</span>
            </div>
          </div>

          {/* Daily prompt card */}
          <div className="scrapbook-widget-card" style={{ minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '12px 16px' }}>
            <h4 className="scrapbook-widget-title" style={{ justifyContent: 'space-between', marginBottom: '8px', paddingBottom: '4px', fontSize: '1rem' }}>
              <span>✍️ Daily Prompt</span>
              <button onClick={rotatePrompt} className="prompt-refresh-btn" title="Refresh Prompt" style={{ top: '8px', right: '8px' }}>
                <RefreshCw size={12} />
              </button>
            </h4>
            <div className="prompt-card-content" style={{ fontSize: '1rem', padding: '2px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, color: 'var(--theme-dark)', textAlign: 'center', lineHeight: '1.3' }}>
              “ {currentPrompt} ”
            </div>
            <div style={{ fontSize: '0.68rem', textAlign: 'right', borderTop: '1px dashed rgba(0,0,0,0.08)', paddingTop: '4px', opacity: 0.7, marginTop: '4px' }}>
              Answer in Notes Universe 📔
            </div>
          </div>

        </div>

        {/* Desk Stickers Panel below */}
        <div className="scrapbook-widget-card" style={{ marginTop: '24px', background: 'rgba(255,255,255,0.3)', borderStyle: 'dashed' }}>
          <h4 className="scrapbook-widget-title">🎀 Scrapbook Stickers Palette</h4>
          <p style={{ fontSize: '0.78rem', opacity: 0.8, marginBottom: '10px' }}>
            Click any stationery element below to place it on your desk board. You can drag, resize (+), and rotate them.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {STICKER_PALETTE.map((emoji) => (
              <span
                key={emoji}
                className="palette-sticker-item"
                onClick={() => addSticker(emoji)}
                style={{ fontSize: '2rem' }}
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`dashboard-layout theme-${activeTheme} ${skyClass} mood-${dashboardMood} custom-desk-overlay`}
      style={{
        fontFamily: fontPairing === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)',
        '--theme-primary': accentColor
      }}
    >
      {/* Background Overlays */}
      <div className="mood-overlay mood-overlay-dreamy" />
      <div className="mood-overlay mood-overlay-romantic" />
      <div className="mood-overlay mood-overlay-nostalgic" />
      <div className="mood-overlay mood-overlay-calm" />
      <div className="mood-overlay mood-overlay-motivated" />
      <div className="grain-texture" />

      {/* Floating Ambient Decorations */}
      <div className="ambient-deco-item" style={{ top: '15%', left: '300px', animation: 'slow-bob 8s ease-in-out infinite' }}>🌸</div>
      <div className="ambient-deco-item" style={{ top: '65%', left: '340px', animation: 'slow-drift 10s ease-in-out infinite' }}>🎀</div>
      <div className="ambient-deco-item" style={{ top: '35%', right: '80px', animation: 'slow-bob 12s ease-in-out infinite' }}>✨</div>
      <div className="ambient-deco-item" style={{ top: '75%', right: '250px', animation: 'slow-drift 9s ease-in-out infinite' }}>🍒</div>
      <div className="ambient-deco-item" style={{ top: '8%', right: '350px', animation: 'slow-bob 11s ease-in-out infinite' }}>☁️</div>

      {/* Draggable Sticker System */}
      <div className="stickers-board">
        {stickers.map((s) => (
          <div
            key={s.id}
            className="placed-sticker"
            style={{
              left: `${s.x}px`,
              top: `${s.y}px`,
              transform: `rotate(${s.rotate}deg) scale(${s.scale})`
            }}
            onMouseDown={(e) => handleStickerDragStart(e, s.id)}
            onTouchStart={(e) => handleStickerDragStart(e, s.id)}
          >
            <div className="placed-sticker-content">{s.emoji}</div>
            <div className="sticker-ui-handle sticker-rotate-handle" title="Rotate" onClick={(e) => { e.stopPropagation(); adjustSticker(s.id, 'rotate'); }}>🔄</div>
            <div className="sticker-ui-handle sticker-resize-handle" title="Resize" onClick={(e) => { e.stopPropagation(); adjustSticker(s.id, 'grow'); }}>➕</div>
            <div className="sticker-ui-handle" style={{ top: '-10px', left: '15px' }} title="Delete" onClick={(e) => { e.stopPropagation(); removeSticker(s.id); }}>❌</div>
          </div>
        ))}
      </div>

      {/* Dreamy Alerts/Toasts */}
      <div className="dreamy-toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className="dreamy-toast">
            <span>🌸</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        userEmail={userEmail}
        onLogout={onLogout}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        notes={notes}
      />

      <div className="dashboard-main">
        <Topbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onNewNoteClick={() => {
            setActivePage('notes');
            setIsCreateOpen(true);
          }}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          notesCount={notes.length}
        />

        {/* Global Mood space widget (Always visible at the top of the desk) */}
        <div className="scrapbook-widget-card" style={{ 
          marginBottom: '24px', 
          background: 'rgba(255,255,255,0.65)', 
          borderStyle: 'dashed',
          borderRadius: '20px',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          height: 'auto',
          minHeight: '100px',
          overflow: 'visible'
        }}>
          <h4 className="scrapbook-widget-title" style={{ 
            fontSize: '1.0rem', 
            borderBottom: '1px dashed rgba(0,0,0,0.1)', 
            marginBottom: 0, 
            paddingBottom: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            color: 'var(--theme-dark)'
          }}>
            ☁️ How is your energy today?
          </h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
            {DASHBOARD_MOODS.map(m => (
              <button
                key={m.id}
                onClick={() => handleMoodSelect(m.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: 'var(--handdrawn-border)',
                  backgroundColor: dashboardMood === m.id ? 'var(--theme-primary)' : '#fffaf8',
                  color: dashboardMood === m.id ? '#fffaf8' : 'var(--theme-dark)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s',
                  boxShadow: dashboardMood === m.id ? '2px 2px 0px var(--theme-dark)' : '1px 1px 0px rgba(0,0,0,0.05)'
                }}
              >
                <span>{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            ))}
            <button 
              onClick={() => setIsPersonalizationOpen(!isPersonalizationOpen)}
              className="tag-pill"
              style={{ marginLeft: 'auto', padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Settings size={12} /> Personalize Desk
            </button>
          </div>
        </div>

        {/* Desk Personalization options panel */}
        {isPersonalizationOpen && (
          <div className="personalization-drawer" style={{ marginBottom: '24px', animation: 'modal-pop 0.3s ease-out' }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', borderBottom: '1px dashed var(--theme-dark)', paddingBottom: '6px', marginBottom: '10px' }}>
              🎨 Customize Stationery Setup
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Stationery Theme</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                  {THEMES.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme.id)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '0.7rem',
                        border: '1px solid var(--theme-dark)',
                        borderRadius: '6px',
                        backgroundColor: activeTheme === theme.id ? 'var(--theme-primary)' : '#fffaf8',
                        color: activeTheme === theme.id ? '#fffaf8' : 'var(--theme-dark)',
                        cursor: 'pointer'
                      }}
                    >
                      {theme.label.split(' ').slice(1).join(' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Ink/Accent Color</label>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  {['#D23B4C', '#7251B5', '#E05275', '#556B2F', '#CD6A7C', '#FF85A2'].map(color => (
                    <div
                      key={color}
                      onClick={() => handleCustomizationSave('accent', color, setAccentColor)}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        border: accentColor === color ? '2px solid var(--theme-dark)' : '1px solid rgba(0,0,0,0.15)',
                        cursor: 'pointer',
                        transform: accentColor === color ? 'scale(1.1)' : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Handwriting Font</label>
                <select 
                  value={fontPairing} 
                  onChange={(e) => handleCustomizationSave('font', e.target.value, setFontPairing)}
                  style={{ marginTop: '4px', fontSize: '0.75rem', padding: '4px' }}
                >
                  <option value="serif">Playfair Handwriting 🖋️</option>
                  <option value="sans">Outfit Sans 🎀</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Desk Sky Lighting</label>
                <select 
                  value={skyOverride} 
                  onChange={(e) => handleCustomizationSave('sky', e.target.value, setSkyOverride)}
                  style={{ marginTop: '4px', fontSize: '0.75rem', padding: '4px' }}
                >
                  <option value="auto">Live time (Auto) ⏰</option>
                  <option value="morning">Morning Glow ☀️</option>
                  <option value="golden">Golden Hour 🌇</option>
                  <option value="twilight">Cozy Twilight 🌆</option>
                  <option value="moonlight">Moonlight Dreams 🌙</option>
                  <option value="rainy">Rainy Window 🌧</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic page router body */}
        {renderSubPage()}

      </div>

      <CreateNoteModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateNote}
      />

      <EditNoteModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedNote(null);
        }}
        onSubmit={handleUpdateNote}
        note={selectedNote}
      />

      {/* Floating Minimized Spotify Vinyl Player badge */}
      {isMusicMinimized && (
        <div 
          className={`minimized-floating-vinyl ${isMusicPlaying ? 'spinning' : ''}`}
          onClick={() => {
            setIsMusicMinimized(false);
            showToast('turntable maximized! 💿');
          }}
          title="Restore Spotify Vinyl Player"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '100px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #D23B4C 30%, #4E3B3E 31%, #CD6A7C 60%, #000 100%)',
            border: '2px solid #4E3B3E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(78, 59, 62, 0.3)',
            zIndex: 1050,
            transition: 'all 0.3s'
          }}
        >
          <span style={{ fontSize: '7px', position: 'absolute', background: '#fffaf8', padding: '1px 3px', borderRadius: '4px', border: '1px solid #4E3B3E', fontWeight: 'bold', top: '-8px', color: '#4E3B3E' }}>
            {isMusicPlaying ? 'SPINNING' : 'PAUSED'}
          </span>
          🌸
        </div>
      )}
      
      {/* Memory Jar Reveal Modal */}
      {memoryJarOpen && randomMemory && (
        <div className="modal-overlay" onClick={() => setMemoryJarOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '420px', padding: '40px 24px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔮</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--theme-primary)', marginBottom: '10px' }}>
              Nostalgic Scrap Recovered
            </h3>
            <p style={{ fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '20px', opacity: 0.8 }}>
              Remember writing this? ♡
            </p>

            <div 
              className={`note-card theme-${randomMemory.color_theme || 'cream'}`}
              style={{ textAlign: 'left', cursor: 'default', boxShadow: 'var(--paper-shadow)' }}
            >
              <div className="note-tape"></div>
              <h3 className="note-title">{randomMemory.title}</h3>
              <div className="note-content rich-content" dangerouslySetInnerHTML={{ __html: randomMemory.content }} />
              {randomMemory.song_title && (
                <div className="music-pill">
                  <span className="vinyl-icon">💿</span>
                  <span>{randomMemory.song_title}</span>
                </div>
              )}
            </div>

            <button 
              onClick={() => setMemoryJarOpen(false)}
              className="cute-btn" 
              style={{ marginTop: '24px', padding: '8px 24px' }}
            >
              Put back in Jar ✨
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
