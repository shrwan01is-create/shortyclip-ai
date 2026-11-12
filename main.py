import os
import uuid
import subprocess
from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from yt_dlp import YoutubeDL
from imageio_ffmpeg import get_ffmpeg_exe

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

jobs = {}

@app.get("/")
def read_root():
    return {
        "message": "ShortyClip AI backend is running",
        "video_processing_ready": True
    }

@app.post("/process-youtube")
def process_youtube(request: YouTubeRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    jobs[job_id] = {"status": "processing", "clips": []}
    background_tasks.add_task(generate_clips, job_id, request.url)
    return {
        "message": "YouTube link received",
        "job_id": job_id,
        "status": "queued"
    }

def generate_clips(job_id, url):
    try:
        tmp = f"/tmp/{job_id}"
        os.makedirs(tmp, exist_ok=True)

        ydl_opts = {
            "outtmpl": f"{tmp}/input.%(ext)s",
            "format": "best[ext=mp4]/best",
            "quiet": True,
        }
        with YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

        input_file = None
        for f in os.listdir(tmp):
            if f.startswith("input."):
                input_file = os.path.join(tmp, f)
                break

        if not input_file:
            jobs[job_id] = {"status": "error", "clips": []}
            return

        ffmpeg = get_ffmpeg_exe()
        clips = []
        for i in range(3):
            start = i * 15
            out = f"{tmp}/clip{i+1}.mp4"
            subprocess.run([
                ffmpeg, "-y", "-i", input_file,
                "-ss", str(start), "-t", "15",
                out
            ], check=True, capture_output=True)
            clips.append(f"/files/{job_id}/clip{i+1}.mp4")

        jobs[job_id] = {"status": "done", "clips": clips}
    except Exception as e:
        jobs[job_id] = {"status": "error", "clips": [], "error": str(e)}

@app.get("/status/{job_id}")
def get_status(job_id: str):
    return jobs.get(job_id, {"status": "not_found", "clips": []})

app.mount("/files", StaticFiles(directory="/tmp"), name="files")

@app.post("/upload-video")
async def upload_video(file: UploadFile = File(...)):
    return {
        "message": "Video received",
        "filename": file.filename,
        "content_type": file.content_type,
        "status": "queued"
    }
