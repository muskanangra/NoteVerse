const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const getHeaders = () => {
  const token = localStorage.getItem('cherry_notes_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const notesApi = {
  // Authentication
  signup: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || 'Failed to sign up');
    }
    const data = await res.json();
    localStorage.setItem('cherry_notes_token', data.access_token);
    return data;
  },

  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || 'Incorrect email or password');
    }
    const data = await res.json();
    localStorage.setItem('cherry_notes_token', data.access_token);
    return data;
  },

  logout: () => {
    localStorage.removeItem('cherry_notes_token');
  },

  // Notes CRUD
  getNotes: async () => {
    const res = await fetch(`${API_BASE_URL}/notes`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) {
      throw new Error('Failed to retrieve notes');
    }
    return res.json();
  },

  createNote: async (noteData) => {
    const res = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(noteData),
    });
    if (!res.ok) {
      throw new Error('Failed to create note');
    }
    return res.json();
  },

  updateNote: async (noteId, noteData) => {
    const res = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(noteData),
    });
    if (!res.ok) {
      throw new Error('Failed to update note');
    }
    return res.json();
  },

  deleteNote: async (noteId) => {
    const res = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) {
      throw new Error('Failed to delete note');
    }
    return res.json();
  },
};
