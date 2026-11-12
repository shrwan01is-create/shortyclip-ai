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

async function getClips() {
  const url = document.getElementById("youtubeUrl").value;
  const resultBox = document.getElementById("youtubeResult");

  resultBox.textContent = "Processing...";

  try {
    const response = await fetch(`${API_URL}/process-youtube`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: url })
    });

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
    const { FFmpeg } = FFmpegWASM;
    const { fetchFile, toBlobURL } = FFmpegUtil;

    const coreURL = await toBlobURL(
      "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js",
      "text/javascript"
    );
    const wasmURL = await toBlobURL(
      "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm",
      "application/wasm"
    );
    const classWorkerURL = await toBlobURL(
      "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/dist/umd/814.ffmpeg.js",
      "text/javascript"
    );

    const ffmpeg = new FFmpeg();
    await ffmpeg.load({
      coreURL,
      wasmURL,
      classWorkerURL
    });

    resultBox.textContent = "Processing video...";

    await ffmpeg.writeFile("input.mp4", await fetchFile(file));

    const clips = [];
    for (let i = 0; i < 3; i++) {
      const start = i * 15;
      await ffmpeg.exec(["-i", "input.mp4", "-ss", start.toString(), "-t", "15", `clip${i+1}.mp4`]);
      const data = ffmpeg.readFile(`clip${i+1}.mp4`);
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
document.getElementById("getClipsBtn").addEventListener("click", getClips);
document.getElementById("uploadBtn").addEventListener("click", generateClips);
