const API_URL = "https://shortyclip-ai.onrender.com";

async function testBackend() {
  const resultBox = document.getElementById("backendResult");
  resultBox.textContent = "Testing...";

  try {
    const response = await fetch(`${API_URL}/`);
    const data = await response.json();
    resultBox.textContent = JSON.stringify(data);
  } catch (error) {
    resultBox.textContent = "Error: " + error.message;
  }
}

async function generateClips() {
  const fileInput = document.getElementById("videoFile");
  const resultBox = document.getElementById("uploadResult");
  const file = fileInput.files[0];

  if (!file) {
    resultBox.textContent = "Please select a video file first.";
    return;
  }

  resultBox.textContent = "Loading FFmpeg...";

  try {
    const { createFFmpeg, fetchFile } = FFmpeg;

    const ffmpeg = createFFmpeg({
      log: true,
      corePath: "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js"
    });

    await ffmpeg.load();

    resultBox.textContent = "Processing video...";

    ffmpeg.FS("writeFile", "input.mp4", await fetchFile(file));

    const clips = [];
    for (let i = 0; i < 3; i++) {
      const start = i * 15;
      await ffmpeg.run(
        "-i", "input.mp4",
        "-ss", start.toString(),
        "-t", "15",
        `clip${i+1}.mp4`
      );
      const data = ffmpeg.FS("readFile", `clip${i+1}.mp4`);
      const blob = new Blob([data.buffer], { type: "video/mp4" });
      clips.push(URL.createObjectURL(blob));
    }

    resultBox.innerHTML = clips.map((url, i) =>
      `<a href="${url}" download="clip${i+1}.mp4">Download Clip ${i+1}</a><br>`
    ).join("");

  } catch (error) {
    resultBox.textContent = "Error: " + error.message;
  }
}

document.getElementById("testBackendBtn").addEventListener("click", testBackend);
document.getElementById("uploadBtn").addEventListener("click", generateClips);
