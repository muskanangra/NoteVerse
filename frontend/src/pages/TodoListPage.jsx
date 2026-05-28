import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, CheckSquare, Sparkles, Check, Heart, Edit3 } from 'lucide-react';

const CATEGORIES = [
  { id: 'self-care', label: '🌸 Self Care', color: '#FFD5E0' },
  { id: 'school', label: '🏫 School', color: '#E8DFF5' },
  { id: 'creative', label: '🎨 Creative', color: '#FCF4DD' },
  { id: 'personal', label: '💖 Personal', color: '#FAD2E1' },
  { id: 'work', label: '💼 Work', color: '#D6EADF' },
  { id: 'dreams', label: '✨ Dreams', color: '#FFEBF0' }
];

export default function TodoListPage({ showToast }) {
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem('cherry_notes_todos');
      return saved ? JSON.parse(saved) : [
        { id: 1, text: 'Buy fresh strawberries 🍓', completed: false, category: 'self-care', priority: 'medium', dueDate: '2026-05-30', rotate: -1.5 },
        { id: 2, text: 'Sketch in my design scrapbook', completed: true, category: 'creative', priority: 'low', dueDate: '2026-05-28', rotate: 2 },
        { id: 3, text: 'Outline my dream life vision board', completed: false, category: 'dreams', priority: 'high', dueDate: '2026-06-01', rotate: -1 }
      ];
    } catch (e) {
      return [
        { id: 1, text: 'Buy fresh strawberries 🍓', completed: false, category: 'self-care', priority: 'medium', dueDate: '2026-05-30', rotate: -1.5 },
        { id: 2, text: 'Sketch in my design scrapbook', completed: true, category: 'creative', priority: 'low', dueDate: '2026-05-28', rotate: 2 },
        { id: 3, text: 'Outline my dream life vision board', completed: false, category: 'dreams', priority: 'high', dueDate: '2026-06-01', rotate: -1 }
      ];
    }
  });

  const [text, setText] = useState('');
  const [category, setCategory] = useState('self-care');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Active animations stack
  const [activeAnimations, setActiveAnimations] = useState([]);

  useEffect(() => {
    localStorage.setItem('cherry_notes_todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (isEditing) {
      setTodos(prev => prev.map(t => {
        if (t.id === editId) {
          return { ...t, text, category, priority, dueDate };
        }
        return t;
      }));
      setIsEditing(false);
      setEditId(null);
      showToast("task updated on your desk! 📝");
    } else {
      const newTodo = {
        id: Date.now(),
        text,
        completed: false,
        category,
        priority,
        dueDate: dueDate || new Date().toISOString().split('T')[0],
        rotate: (Math.random() * 4 - 2) // tilt range: -2deg to 2deg
      };
      setTodos(prev => [newTodo, ...prev]);
      showToast("added a new tiny goal 🎀");
    }

    setText('');
    setCategory('self-care');
    setPriority('medium');
    setDueDate('');
  };

  const handleToggleComplete = (id, e) => {
    // Sparkle effect coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    const animId = Date.now() + Math.random();

    setTodos(prev => prev.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        if (nextState) {
          // Play flower bloom / sparkle animation
          setActiveAnimations(a => [...a, { id: animId, x: rect.left + window.scrollX, y: rect.top + window.scrollY }]);
          setTimeout(() => {
            setActiveAnimations(a => a.filter(item => item.id !== animId));
          }, 1200);
          showToast("sparkling progress unlocked! ♡");
        }
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  const handleEditClick = (todo) => {
    setText(todo.text);
    setCategory(todo.category);
    setPriority(todo.priority);
    setDueDate(todo.dueDate);
    setIsEditing(true);
    setEditId(todo.id);
  };

  const handleDeleteTodo = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
    showToast("task thrown away gently 🗑️");
  };

  const getCategoryColor = (catId) => {
    const cat = CATEGORIES.find(c => c.id === catId);
    return cat ? cat.color : '#fffaf8';
  };

  const getPriorityLabel = (prio) => {
    if (prio === 'high') return '🔥 Urgent';
    if (prio === 'medium') return '🌸 Flow';
    return '☁️ Soft';
  };

  return (
    <div style={{ animation: 'modal-pop 0.3s ease-out', position: 'relative' }}>
      
      {/* Floating complete animation particles */}
      {activeAnimations.map(anim => (
        <div
          key={anim.id}
          style={{
            position: 'absolute',
            left: `${anim.x - 30}px`,
            top: `${anim.y - 80}px`,
            pointerEvents: 'none',
            zIndex: 1000,
            animation: 'float-slow 1.2s ease-out forwards',
            display: 'flex',
            gap: '8px',
            fontSize: '1.5rem'
          }}
        >
          <span>💖</span>
          <span>✨</span>
          <span>🌸</span>
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 className="cozy-twilight-espresso-heading" style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--theme-primary)', marginBottom: '4px' }}>
            📝 To-Do Lists
          </h2>
          <p style={{ fontSize: '0.88rem', opacity: 0.8 }}>
            Remember, tiny steps are still beautiful progress ♡
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', alignItems: 'start' }}>
        
        {/* Creator sticky-note input card */}
        <div 
          className="scrapbook-widget-card" 
          style={{ 
            background: '#fff7f9', 
            transform: 'rotate(-0.5deg)', 
            border: '1.2px solid var(--theme-border-color)' 
          }}
        >
          <div className="note-tape" style={{ left: '35%', width: '30%' }}></div>
          <h4 className="scrapbook-widget-title" style={{ marginTop: '10px' }}>
            {isEditing ? '✍️ Edit Tiny Step' : '🎀 Plant a Tiny Goal'}
          </h4>
          <form onSubmit={handleAddTodo} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>What is your goal?</label>
              <input
                type="text"
                placeholder="e.g. read 5 pages of my book"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                style={{ padding: '8px 12px', border: '1.2px solid var(--theme-border-color)', borderRadius: '10px', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ padding: '8px', border: '1.2px solid var(--theme-border-color)', borderRadius: '10px', fontSize: '0.8rem', width: '100%' }}
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{ padding: '8px', border: '1.2px solid var(--theme-border-color)', borderRadius: '10px', fontSize: '0.8rem', width: '100%' }}
                >
                  <option value="low">☁️ Soft</option>
                  <option value="medium">🌸 Flow</option>
                  <option value="high">🔥 Urgent</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{ padding: '8px 12px', border: '1.2px solid var(--theme-border-color)', borderRadius: '10px', fontSize: '0.85rem' }}
              />
            </div>

            <button type="submit" className="cute-btn" style={{ padding: '8px', justifyContent: 'center', marginTop: '6px' }}>
              {isEditing ? 'Update Step 💖' : 'Plant Seed 🌸'}
            </button>
          </form>
        </div>

        {/* Tasks display area */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {todos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', border: '1.5px dashed var(--theme-border-color)', borderRadius: '20px', background: 'rgba(255,255,255,0.3)' }}>
              <span style={{ fontSize: '2.5rem' }}>🌱</span>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginTop: '12px', fontStyle: 'italic' }}>
                "tiny steps are still beautiful progress ♡"
              </p>
              <p style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '4px' }}>
                Add your first dream scrap task to begin growing your garden.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {todos.map(todo => (
                <div
                  key={todo.id}
                  className="paper-sheet"
                  style={{
                    backgroundColor: getCategoryColor(todo.category),
                    transform: `rotate(${todo.rotate}deg)`,
                    padding: '20px 16px 16px 16px',
                    borderRadius: '16px',
                    boxShadow: 'var(--paper-shadow)',
                    border: '1.2px solid var(--theme-border-color)',
                    position: 'relative',
                    transition: 'all 0.2s',
                    minHeight: '140px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div className="note-tape" style={{ top: '-8px', left: '25%', width: '50%', background: 'rgba(255,255,255,0.45)' }}></div>
                  
                  {/* Task Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', tracking: '0.5px', opacity: 0.7 }}>
                      {CATEGORIES.find(c => c.id === todo.category)?.label || todo.category}
                    </span>
                    <span style={{ fontSize: '0.68rem', background: 'rgba(255,255,255,0.6)', padding: '2px 6px', borderRadius: '8px', fontWeight: 600 }}>
                      {getPriorityLabel(todo.priority)}
                    </span>
                  </div>

                  {/* Task Text */}
                  <div 
                    onClick={(e) => handleToggleComplete(todo.id, e)}
                    style={{ 
                      fontSize: '0.92rem', 
                      fontWeight: 500, 
                      color: 'var(--theme-dark)', 
                      cursor: 'pointer',
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      opacity: todo.completed ? 0.6 : 1,
                      wordBreak: 'break-word',
                      flex: 1,
                      margin: '6px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      border: '1.2px solid var(--theme-border-color)',
                      background: todo.completed ? 'var(--theme-primary)' : '#FFFDF9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s'
                    }}>
                      {todo.completed && <Check size={12} style={{ color: '#fff' }} />}
                    </div>
                    <span>{todo.text}</span>
                  </div>

                  {/* Task Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed rgba(78,59,62,0.1)' }}>
                    <span style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.8 }}>
                      <Calendar size={11} /> {todo.dueDate}
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button 
                        onClick={() => handleEditClick(todo)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '2px', color: 'var(--theme-dark)', opacity: 0.6 }}
                        title="Edit goal"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button 
                        onClick={() => handleDeleteTodo(todo.id)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '2px', color: '#D23B4C' }}
                        title="Delete goal"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
