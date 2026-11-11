from fastapi import FastAPI

app = FastAPI(title="ShortyClip AI Backend")


@app.get("/")
def home():
    return {
        "message": "ShortyClip AI backend is running",
        "video_processing_ready": True
    }


@app.get("/health")
def health():
    return {"status": "ok"}
