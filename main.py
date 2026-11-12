from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import re
import requests

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

def get_video_id(url):
    match = re.search(r"(?:v=|youtu\.be/)([A-Za-z0-9_-]{11})", url)
    return match.group(1) if match else None

@app.post("/process-youtube")
def process_youtube(request: YouTubeRequest):
    video_id = get_video_id(request.url)

    if not video_id:
        return {
            "message": "Invalid YouTube link",
            "status": "failed"
        }

    api_key = os.getenv("YOUTUBE_API_KEY")

    if not api_key:
        return {
            "message": "YouTube API key missing",
            "status": "failed"
        }

    url = (
        f"https://www.googleapis.com/youtube/v3/videos"
        f"?part=snippet,contentDetails,statistics"
        f"&id={video_id}"
        f"&key={api_key}"
    )

    try:
        response = requests.get(url)
        data = response.json()

        if not data.get("items"):
            return {
                "message": "Video not found",
                "status": "failed",
                "api_status": response.status_code,
                "api_error": data
            }

        item = data["items"][0]
        snippet = item.get("snippet", {})
        details = item.get("contentDetails", {})
        stats = item.get("statistics", {})

        return {
            "message": "Video info received",
            "title": snippet.get("title"),
            "channel": snippet.get("channelTitle"),
            "duration": details.get("duration"),
            "views": stats.get("viewCount"),
            "thumbnail": snippet.get("thumbnails", {}).get("high", {}).get("url"),
            "status": "ready"
        }

    except Exception as e:
        return {
            "message": "Error processing video",
            "error": str(e),
            "status": "failed"
        }
