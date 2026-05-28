import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, RefreshCw, Star, Heart, Calendar } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function WeeklyPlannerPage({ showToast }) {
  // Weekly Timetable schedules
  const [schedule, setSchedule] = useState(() => {
    try {
      const saved = localStorage.getItem('cherry_notes_weekly_schedule');
      return saved ? JSON.parse(saved) : {
        Monday: [{ id: 1, text: 'Morning tea & stretch 🍵', time: '08:00' }],
        Tuesday: [{ id: 2, text: 'Aesthetic room cleanup 🌸', time: '16:00' }],
        Wednesday: [],
        Thursday: [{ id: 3, text: 'Lofi journaling hour 🌙', time: '20:00' }],
        Friday: [],
        Saturday: [{ id: 4, text: 'Picnic at the park 🧺', time: '14:00' }],
        Sunday: []
      };
    } catch (e) {
      return {
        Monday: [{ id: 1, text: 'Morning tea & stretch 🍵', time: '08:00' }],
        Tuesday: [{ id: 2, text: 'Aesthetic room cleanup 🌸', time: '16:00' }],
        Wednesday: [],
        Thursday: [{ id: 3, text: 'Lofi journaling hour 🌙', time: '20:00' }],
        Friday: [],
        Saturday: [{ id: 4, text: 'Picnic at the park 🧺', time: '14:00' }],
        Sunday: []
      };
    }
  });

  // Habit Tracker state
  const [habits, setHabits] = useState(() => {
    try {
      const saved = localStorage.getItem('cherry_notes_habits');
      return saved ? JSON.parse(saved) : [
        { id: 1, name: 'Journaling 📔', history: { Monday: true, Tuesday: false, Wednesday: true } },
        { id: 2, name: 'Drink Matcha 🍵', history: { Monday: true, Tuesday: true, Wednesday: false } },
        { id: 3, name: '8 Hours Sleep ☁️', history: { Monday: false, Tuesday: true, Wednesday: true } }
      ];
    } catch (e) {
      return [
        { id: 1, name: 'Journaling 📔', history: { Monday: true, Tuesday: false, Wednesday: true } },
        { id: 2, name: 'Drink Matcha 🍵', history: { Monday: true, Tuesday: true, Wednesday: false } },
        { id: 3, name: '8 Hours Sleep ☁️', history: { Monday: false, Tuesday: true, Wednesday: true } }
      ];
    }
  });

  // Weekly Goals & Priorities
  const [goals, setGoals] = useState(() => {
    try {
      const saved = localStorage.getItem('cherry_notes_weekly_goals');
      return saved ? JSON.parse(saved) : [
        { id: 1, text: 'Live with soft energy', completed: true },
        { id: 2, text: 'Read 2 chapters of book', completed: false }
      ];
    } catch (e) {
      return [
        { id: 1, text: 'Live with soft energy', completed: true },
        { id: 2, text: 'Read 2 chapters of book', completed: false }
      ];
    }
  });

  const [reminders, setReminders] = useState(() => {
    return localStorage.getItem('cherry_notes_weekly_reminders') || 'Send warm letter to Emily 🎀\nWater the daisies 🌼';
  });

  // Forms state
  const [activeDay, setActiveDay] = useState('Monday');
  const [schedText, setSchedText] = useState('');
  const [schedTime, setSchedTime] = useState('12:00');
  const [newHabitName, setNewHabitName] = useState('');
  const [newGoalText, setNewGoalText] = useState('');

  useEffect(() => {
    localStorage.setItem('cherry_notes_weekly_schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('cherry_notes_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('cherry_notes_weekly_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('cherry_notes_weekly_reminders', reminders);
  }, [reminders]);

  const handleAddSchedule = (e) => {
    e.preventDefault();
    if (!schedText.trim()) return;

    const newItem = {
      id: Date.now(),
      text: schedText,
      time: schedTime
    };

    setSchedule(prev => ({
      ...prev,
      [activeDay]: [...prev[activeDay], newItem].sort((a,b) => a.time.localeCompare(b.time))
    }));
    setSchedText('');
    showToast(`added schedule for ${activeDay} ✨`);
  };

  const handleDeleteSchedule = (day, id) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].filter(item => item.id !== id)
    }));
    showToast("removed event from schedule.");
  };

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newHabit = {
      id: Date.now(),
      name: newHabitName,
      history: {}
    };
    setHabits(prev => [...prev, newHabit]);
    setNewHabitName('');
    showToast("new habit planted 🌱");
  };

  const handleToggleHabit = (habitId, day) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        return {
          ...h,
          history: {
            ...h.history,
            [day]: !h.history[day]
          }
        };
      }
      return h;
    }));
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;

    setGoals(prev => [...prev, { id: Date.now(), text: newGoalText, completed: false }]);
    setNewGoalText('');
    showToast("added weekly target 🎯");
  };

  const handleToggleGoal = (id) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) return { ...g, completed: !g.completed };
      return g;
    }));
  };

  return (
    <div style={{ animation: 'modal-pop 0.3s ease-out' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 className="cozy-twilight-espresso-heading" style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--theme-primary)', marginBottom: '4px' }}>
            🗓️ Weekly Planner & Calendar
          </h2>
          <p style={{ fontSize: '0.88rem', opacity: 0.8 }}>
            Organize your cozy days, track soft habits, and document weekly goals.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', alignItems: 'start' }}>
        
        {/* Left Side: Weekly Calendar view */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="paper-sheet" style={{ padding: '24px', borderRadius: '20px', border: '1.2px solid var(--theme-border-color)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--theme-primary)', marginBottom: '16px', display: 'flex', gap: '8px' }}>
              🗓️ My Weekly Calendar
            </h3>
            
            {/* Monday - Sunday layouts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
              {DAYS.map(day => (
                <div 
                  key={day}
                  style={{
                    border: '1px dashed rgba(78,59,62,0.2)',
                    borderRadius: '12px',
                    padding: '12px',
                    minHeight: '160px',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <h5 style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9rem', color: 'var(--theme-primary)', borderBottom: '1px solid rgba(78,59,62,0.1)', paddingBottom: '4px', marginBottom: '8px' }}>
                      {day}
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {schedule[day].map(item => (
                        <div 
                          key={item.id}
                          style={{
                            background: '#fff',
                            border: '1px solid rgba(78,59,62,0.15)',
                            borderRadius: '8px',
                            padding: '6px 8px',
                            fontSize: '0.75rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: '1px 1px 3px rgba(0,0,0,0.03)'
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: 600, color: 'var(--theme-primary)', marginRight: '4px' }}>{item.time}</span>
                            <span>{item.text}</span>
                          </div>
                          <button 
                            onClick={() => handleDeleteSchedule(day, item.id)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#D23B4C', padding: 0 }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveDay(day)} 
                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--theme-primary)', fontSize: '0.7rem', fontWeight: 600, textAlign: 'left', marginTop: '10px' }}
                  >
                    + Add event
                  </button>
                </div>
              ))}
            </div>

            {/* Quick schedule add form */}
            <form onSubmit={handleAddSchedule} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '20px', borderTop: '1px dashed rgba(78,59,62,0.15)', paddingTop: '15px', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Event Text</label>
                <input
                  type="text"
                  placeholder="e.g. Tea time with friends 🍵"
                  value={schedText}
                  onChange={(e) => setSchedText(e.target.value)}
                  required
                  style={{ padding: '6px 10px', fontSize: '0.8rem', border: '1.2px solid var(--theme-border-color)', borderRadius: '8px' }}
                />
              </div>
              <div className="form-group" style={{ width: '100px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Time</label>
                <input
                  type="time"
                  value={schedTime}
                  onChange={(e) => setSchedTime(e.target.value)}
                  required
                  style={{ padding: '6px', fontSize: '0.8rem', border: '1.2px solid var(--theme-border-color)', borderRadius: '8px' }}
                />
              </div>
              <div className="form-group" style={{ width: '120px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Target Day</label>
                <select
                  value={activeDay}
                  onChange={(e) => setActiveDay(e.target.value)}
                  style={{ padding: '6px', fontSize: '0.8rem', border: '1.2px solid var(--theme-border-color)', borderRadius: '8px' }}
                >
                  {DAYS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="cute-btn" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                Schedule ✨
              </button>
            </form>
          </div>

          {/* HABIT TRACKER GRID */}
          <div className="paper-sheet" style={{ padding: '24px', borderRadius: '20px', border: '1.2px solid var(--theme-border-color)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--theme-primary)', marginBottom: '16px', display: 'flex', gap: '8px' }}>
              🌸 Daily Habit Garden
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1.2px solid var(--theme-border-color)' }}>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Habit</th>
                    {DAYS.slice(0, 5).map(d => (
                      <th key={d} style={{ padding: '8px', width: '60px' }}>{d.slice(0, 3)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {habits.map(habit => (
                    <tr key={habit.id} style={{ borderBottom: '1px dashed rgba(78,59,62,0.1)' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 600 }}>{habit.name}</td>
                      {DAYS.slice(0, 5).map(day => (
                        <td key={day} style={{ textAlign: 'center', padding: '8px' }}>
                          <button
                            onClick={() => handleToggleHabit(habit.id, day)}
                            style={{
                              border: '1.2px solid var(--theme-border-color)',
                              background: habit.history[day] ? 'var(--theme-primary)' : 'transparent',
                              width: '18px',
                              height: '18px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {habit.history[day] && <Check size={11} style={{ color: '#fff' }} />}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Habit Form */}
            <form onSubmit={handleAddHabit} style={{ display: 'flex', gap: '10px', marginTop: '16px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="e.g. Read book 📚"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                required
                style={{ padding: '6px 12px', fontSize: '0.8rem', border: '1.2px solid var(--theme-border-color)', borderRadius: '8px', flex: 1 }}
              />
              <button type="submit" className="cute-btn" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                Grow habit 🌱
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Goals & Reminders sticky notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Goals Card */}
          <div className="scrapbook-widget-card" style={{ background: '#fffaf8', border: '1.2px solid var(--theme-border-color)' }}>
            <div className="note-tape"></div>
            <h4 className="scrapbook-widget-title" style={{ marginTop: '10px' }}>🌟 Weekly Goals</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              {goals.map(g => (
                <div 
                  key={g.id} 
                  onClick={() => handleToggleGoal(g.id)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    fontSize: '0.85rem', 
                    cursor: 'pointer',
                    textDecoration: g.completed ? 'line-through' : 'none',
                    opacity: g.completed ? 0.6 : 1
                  }}
                >
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    border: '1.2px solid var(--theme-border-color)',
                    background: g.completed ? 'var(--theme-primary)' : '#fff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {g.completed && <Check size={10} style={{ color: '#fff' }} />}
                  </div>
                  <span>{g.text}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddGoal} style={{ display: 'flex', gap: '6px', marginTop: '14px' }}>
              <input
                type="text"
                placeholder="e.g. drink water"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                required
                style={{ padding: '5px 10px', fontSize: '0.78rem', border: '1px solid var(--theme-border-color)', borderRadius: '8px', flex: 1 }}
              />
              <button type="submit" style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--theme-primary)' }}>
                <Plus size={16} />
              </button>
            </form>
          </div>

          {/* Sticky note reminders */}
          <div 
            className="paper-sheet" 
            style={{ 
              background: '#fff7f9', 
              padding: '24px', 
              borderRadius: '20px', 
              border: '1.2px solid var(--theme-border-color)',
              transform: 'rotate(1.5deg)',
              boxShadow: 'var(--paper-shadow)'
            }}
          >
            <div className="note-tape" style={{ left: '30%', width: '40%', background: 'rgba(255,255,255,0.4)' }}></div>
            <h4 className="scrapbook-widget-title" style={{ marginTop: '10px' }}>🎀 Sticky Reminders</h4>
            <textarea
              value={reminders}
              onChange={(e) => setReminders(e.target.value)}
              placeholder="Jot down quick thoughts..."
              style={{
                width: '100%',
                minHeight: '120px',
                border: 'none',
                background: 'transparent',
                resize: 'none',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '0.95rem',
                outline: 'none',
                color: 'var(--theme-dark)'
              }}
            />
          </div>

        </div>

      </div>

    </div>
  );
}
