import sqlite3
import pg8000
import os
import json
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("Error: DATABASE_URL not set in .env")
    exit(1)

print("Connecting to local SQLite database...")
sqlite_conn = sqlite3.connect("easy_notes.db")
sqlite_cursor = sqlite_conn.cursor()

print("Connecting to Supabase PostgreSQL database...")
from urllib.parse import urlparse, unquote
result = urlparse(DATABASE_URL)
pg_conn = pg8000.connect(
    user=result.username,
    password=unquote(result.password) if result.password else None,
    host=result.hostname,
    port=result.port or 5432,
    database=result.path[1:] if result.path else None
)
pg_cursor = pg_conn.cursor()

# Get users
try:
    sqlite_cursor.execute("SELECT id, email, password_hash, created_at FROM users")
    users = sqlite_cursor.fetchall()
except sqlite3.OperationalError:
    users = []

print(f"Found {len(users)} users in local SQLite.")

for u in users:
    print(f"Migrating user: {u[1]}...")
    try:
        pg_cursor.execute(
            "INSERT INTO users (id, email, password_hash, created_at) VALUES (%s, %s, %s, %s) ON CONFLICT (id) DO NOTHING",
            [u[0], u[1], u[2], u[3]]
        )
    except Exception as e:
        print(f"Error migrating user {u[1]}: {e}")

# Get notes
try:
    sqlite_cursor.execute(
        "SELECT id, user_id, title, content, mood, tags, color_theme, image_url, song_title, song_link, is_pinned, is_favorite, created_at, updated_at FROM notes"
    )
    notes = sqlite_cursor.fetchall()
except sqlite3.OperationalError:
    notes = []

print(f"Found {len(notes)} notes in local SQLite.")

for n in notes:
    print(f"Migrating note: {n[2]}...")
    try:
        # Parse tags
        try:
            tags = json.loads(n[5]) if n[5] else []
        except:
            tags = []
            
        pg_cursor.execute(
            """INSERT INTO notes (id, user_id, title, content, mood, tags, color_theme, image_url, song_title, song_link, is_pinned, is_favorite, created_at, updated_at) 
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (id) DO NOTHING""",
            [
                n[0], 
                n[1], 
                n[2], 
                n[3], 
                n[4] or 'neutral', 
                tags, 
                n[6], 
                n[7], 
                n[8], 
                n[9], 
                bool(n[10]), 
                bool(n[11]), 
                n[12], 
                n[13]
            ]
        )
    except Exception as e:
        print(f"Error migrating note {n[2]}: {e}")

pg_conn.commit()
pg_conn.close()
sqlite_conn.close()
print("Migration completed successfully! 🎉")
