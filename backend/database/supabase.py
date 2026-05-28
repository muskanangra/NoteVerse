import os
import sqlite3
# pyrefly: ignore [missing-import]
import pg8000
from dotenv import load_dotenv

# Load env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

import json
import uuid
import datetime

class PostgresCursorWrapper:
    def __init__(self, cursor):
        self.cursor = cursor
        
    def execute(self, sql, params=None):
        # Convert SQLite style placeholder '?' to Postgres style '%s'
        sql = sql.replace('?', '%s')
        if params is not None:
            # If any parameter is a JSON string representing a list (e.g. tags),
            # convert it to a python list so pg8000 inserts it as a Postgres array.
            new_params = []
            for p in params:
                if isinstance(p, str) and p.startswith('[') and p.endswith(']'):
                    try:
                        parsed = json.loads(p)
                        if isinstance(parsed, list):
                            p = parsed
                    except Exception:
                        pass
                new_params.append(p)
            self.cursor.execute(sql, list(new_params))
        else:
            self.cursor.execute(sql)
            
    def _convert_row(self, row):
        if row is None:
            return None
        new_row = []
        for val in row:
            if isinstance(val, uuid.UUID):
                new_row.append(str(val))
            elif isinstance(val, list):
                new_row.append(json.dumps(val))
            elif isinstance(val, (datetime.datetime, datetime.date)):
                new_row.append(val.isoformat())
            else:
                new_row.append(val)
        return tuple(new_row)

    def fetchall(self):
        rows = self.cursor.fetchall()
        return [self._convert_row(row) for row in rows]
        
    def fetchone(self):
        row = self.cursor.fetchone()
        return self._convert_row(row)
        
    def close(self):
        self.cursor.close()

class PostgresConnectionWrapper:
    def __init__(self, conn):
        self.conn = conn
        
    def cursor(self):
        return PostgresCursorWrapper(self.conn.cursor())
        
    def commit(self):
        self.conn.commit()
        
    def close(self):
        self.conn.close()

class DBConnection:
    def __init__(self):
        self.use_supabase = bool(DATABASE_URL)
        self.db_path = "easy_notes.db"
        if not self.use_supabase:
            self._init_sqlite()

    def _init_sqlite(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        # Create users table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """)
        # Create notes table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS notes (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            title TEXT NOT NULL,
            content TEXT,
            mood TEXT,
            tags TEXT, -- Store tags as a JSON string
            color_theme TEXT DEFAULT 'cream',
            image_url TEXT,
            song_title TEXT,
            song_link TEXT,
            is_pinned INTEGER DEFAULT 0,
            is_favorite INTEGER DEFAULT 0,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
        """)
        
        # Auto-migration: check if columns exist, if not add them
        cursor.execute("PRAGMA table_info(notes)")
        columns = [col[1] for col in cursor.fetchall()]
        if "image_url" not in columns:
            cursor.execute("ALTER TABLE notes ADD COLUMN image_url TEXT")
        if "song_title" not in columns:
            cursor.execute("ALTER TABLE notes ADD COLUMN song_title TEXT")
        if "song_link" not in columns:
            cursor.execute("ALTER TABLE notes ADD COLUMN song_link TEXT")
            
        conn.commit()
        conn.close()

    def get_db(self):
        if self.use_supabase:
            from urllib.parse import urlparse, unquote
            result = urlparse(DATABASE_URL)
            conn = pg8000.connect(
                user=result.username,
                password=unquote(result.password) if result.password else None,
                host=result.hostname,
                port=result.port or 5432,
                database=result.path[1:] if result.path else None
            )
            return PostgresConnectionWrapper(conn)
        return sqlite3.connect(self.db_path)

db_manager = DBConnection()

def get_connection():
    return db_manager.get_db()
