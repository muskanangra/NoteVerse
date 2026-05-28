# pyrefly: ignore [missing-import]
import uvicorn
# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, notes

app = FastAPI(
    title="NoteVerse API",
    description="Cherry red & blush pink themed full-stack digital journaling platform backend",
    version="1.0.0"
)

# Enable CORS for frontend application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For easy local development running across random ports
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api", tags=["Authentication"])
app.include_router(notes.router, prefix="/api/notes", tags=["Notes"])

@app.get("/")
def home():
    return {
        "app": "NoteVerse API",
        "description": "Dreamy scrapbook digital journaling backend.",
        "status": "online"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
