from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class NoteBase(BaseModel):
    title: str
    content: Optional[str] = ""
    mood: Optional[str] = "neutral"
    tags: Optional[List[str]] = []
    color_theme: Optional[str] = "cream"
    image_url: Optional[str] = None
    song_title: Optional[str] = None
    song_link: Optional[str] = None
    is_pinned: Optional[bool] = False
    is_favorite: Optional[bool] = False

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    mood: Optional[str] = None
    tags: Optional[List[str]] = None
    color_theme: Optional[str] = None
    image_url: Optional[str] = None
    song_title: Optional[str] = None
    song_link: Optional[str] = None
    is_pinned: Optional[bool] = None
    is_favorite: Optional[bool] = None

class NoteResponse(NoteBase):
    id: str
    user_id: str
    created_at: str
    updated_at: str
