from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yt_dlp

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class YouTubeRequest(BaseModel):
    url: str

@app.get("/")
def read_root():
    return {
        "message": "ShortyClip AI backend is running",
        "video_processing_ready": True
    }

@app.post("/process-youtube")
def process_youtube(request: YouTubeRequest):
    try:
        ydl_opts = {
            "quiet": True,
            "no_warnings": True,
            "skip_download": True
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(request.url, download=False)

        return {
            "message": "Video info received",
            "title": info.get("title"),
            "duration": info.get("duration"),
            "thumbnail": info.get("thumbnail"),
            "status": "ready"
        }

    except Exception as e:
        return {
            "message": "Error processing video",
            "error": str(e),
            "status": "failed"
        }
