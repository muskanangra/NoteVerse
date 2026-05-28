import uuid
import json
import os
from datetime import datetime
from typing import List, Optional
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, HTTPException, Depends, Header, status, UploadFile, File
from models.note import NoteCreate, NoteUpdate, NoteResponse
from routes.auth import get_current_user_id
from database.supabase import get_connection

router = APIRouter()

# Local upload directory mapping to React frontend public folder
UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "public", "uploads"))

def get_auth_user_id(authorization: Optional[str] = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication token."
        )
    token = authorization.split(" ")[1]
    return get_current_user_id(token)

@router.post("/upload")
async def upload_image(file: UploadFile = File(...), user_id: str = Depends(get_auth_user_id)):
    try:
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        # Create a unique filename
        file_ext = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Read file asynchronously
        contents = await file.read()
        with open(file_path, "wb") as buffer:
            buffer.write(contents)
            
        # Vite will serve this from the public folder automatically
        return {"image_url": f"/uploads/{unique_filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

@router.get("", response_model=List[NoteResponse])
def get_notes(user_id: str = Depends(get_auth_user_id)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """SELECT id, user_id, title, content, mood, tags, color_theme, image_url, song_title, song_link, is_pinned, is_favorite, created_at, updated_at 
           FROM notes WHERE user_id = ? ORDER BY is_pinned DESC, created_at DESC""",
        (user_id,)
    )
    rows = cursor.fetchall()
    conn.close()
    
    notes = []
    for r in rows:
        tags_raw = r[5]
        try:
            tags = json.loads(tags_raw) if tags_raw else []
        except:
            tags = []
        notes.append(NoteResponse(
            id=r[0],
            user_id=r[1],
            title=r[2],
            content=r[3],
            mood=r[4],
            tags=tags,
            color_theme=r[6],
            image_url=r[7],
            song_title=r[8],
            song_link=r[9],
            is_pinned=bool(r[10]),
            is_favorite=bool(r[11]),
            created_at=r[12],
            updated_at=r[13]
        ))
    return notes

@router.post("", response_model=NoteResponse)
def create_note(note_data: NoteCreate, user_id: str = Depends(get_auth_user_id)):
    conn = get_connection()
    cursor = conn.cursor()
    
    note_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    tags_str = json.dumps(note_data.tags)
    
    cursor.execute(
        """INSERT INTO notes (id, user_id, title, content, mood, tags, color_theme, image_url, song_title, song_link, is_pinned, is_favorite, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            note_id,
            user_id,
            note_data.title,
            note_data.content,
            note_data.mood,
            tags_str,
            note_data.color_theme,
            note_data.image_url,
            note_data.song_title,
            note_data.song_link,
            1 if note_data.is_pinned else 0,
            1 if note_data.is_favorite else 0,
            now,
            now
        )
    )
    conn.commit()
    conn.close()
    
    return NoteResponse(
        id=note_id,
        user_id=user_id,
        title=note_data.title,
        content=note_data.content,
        mood=note_data.mood,
        tags=note_data.tags,
        color_theme=note_data.color_theme,
        image_url=note_data.image_url,
        song_title=note_data.song_title,
        song_link=note_data.song_link,
        is_pinned=note_data.is_pinned,
        is_favorite=note_data.is_favorite,
        created_at=now,
        updated_at=now
    )

@router.put("/{note_id}", response_model=NoteResponse)
def update_note(note_id: str, note_data: NoteUpdate, user_id: str = Depends(get_auth_user_id)):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Verify ownership
    cursor.execute("SELECT user_id, created_at FROM notes WHERE id = ?", (note_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Note not found")
    if row[0] != user_id:
        conn.close()
        raise HTTPException(status_code=403, detail="Not authorized to edit this note")
        
    created_at = row[1]
    now = datetime.utcnow().isoformat()
    
    # Dynamic update query
    updates = []
    params = []
    
    if note_data.title is not None:
        updates.append("title = ?")
        params.append(note_data.title)
    if note_data.content is not None:
        updates.append("content = ?")
        params.append(note_data.content)
    if note_data.mood is not None:
        updates.append("mood = ?")
        params.append(note_data.mood)
    if note_data.tags is not None:
        updates.append("tags = ?")
        params.append(json.dumps(note_data.tags))
    if note_data.color_theme is not None:
        updates.append("color_theme = ?")
        params.append(note_data.color_theme)
    if note_data.image_url is not None:
        updates.append("image_url = ?")
        params.append(note_data.image_url)
    if note_data.song_title is not None:
        updates.append("song_title = ?")
        params.append(note_data.song_title)
    if note_data.song_link is not None:
        updates.append("song_link = ?")
        params.append(note_data.song_link)
    if note_data.is_pinned is not None:
        updates.append("is_pinned = ?")
        params.append(1 if note_data.is_pinned else 0)
    if note_data.is_favorite is not None:
        updates.append("is_favorite = ?")
        params.append(1 if note_data.is_favorite else 0)
        
    if updates:
        updates.append("updated_at = ?")
        params.append(now)
        
        query = f"UPDATE notes SET {', '.join(updates)} WHERE id = ? AND user_id = ?"
        params.extend([note_id, user_id])
        cursor.execute(query, tuple(params))
        conn.commit()
        
    # Fetch final updated state
    cursor.execute(
        """SELECT title, content, mood, tags, color_theme, image_url, song_title, song_link, is_pinned, is_favorite, updated_at 
           FROM notes WHERE id = ?""",
        (note_id,)
    )
    updated_row = cursor.fetchone()
    conn.close()
    
    try:
        tags = json.loads(updated_row[3]) if updated_row[3] else []
    except:
        tags = []
        
    return NoteResponse(
        id=note_id,
        user_id=user_id,
        title=updated_row[0],
        content=updated_row[1],
        mood=updated_row[2],
        tags=tags,
        color_theme=updated_row[4],
        image_url=updated_row[5],
        song_title=updated_row[6],
        song_link=updated_row[7],
        is_pinned=bool(updated_row[8]),
        is_favorite=bool(updated_row[9]),
        created_at=created_at,
        updated_at=updated_row[10]
    )

@router.delete("/{note_id}")
def delete_note(note_id: str, user_id: str = Depends(get_auth_user_id)):
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT user_id FROM notes WHERE id = ?", (note_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Note not found")
    if row[0] != user_id:
        conn.close()
        raise HTTPException(status_code=403, detail="Not authorized to delete this note")
        
    cursor.execute("DELETE FROM notes WHERE id = ? AND user_id = ?", (note_id, user_id))
    conn.commit()
    conn.close()
    
    return {"message": "Note deleted successfully", "id": note_id}
