from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel

app = FastAPI()

class YouTubeRequest(BaseModel):
    url: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "message": "ShortyClip AI backend is running",
        "video_processing_ready": True
    }

@app.post("/process-youtube")
def process_youtube(request: YouTubeRequest):
    return {
        "message": "YouTube link received",
        "url": request.url,
        "status": "queued"
    }

@app.post("/upload-video")
async def upload_video(file: UploadFile = File(...)):
    return {
        "message": "Video received",
        "filename": file.filename,
        "content_type": file.content_type,
        "status": "queued"
    }
