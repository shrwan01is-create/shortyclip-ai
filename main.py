from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ShortyClip AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "ShortyClip AI backend is running",
        "video_processing_ready": True
    }


@app.get("/health")
def health():
    return {"status": "ok"}
class YouTubeRequest(BaseModel):
    url: str


@app.post("/process-youtube")
def process_youtube(request: YouTubeRequest):
    return {
        "message": "YouTube link received",
        "url": request.url,
        "status": "queued"
    }
