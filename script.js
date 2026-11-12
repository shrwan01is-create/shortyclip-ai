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

async function uploadVideo() {
  const fileInput = document.getElementById("videoFile");
  const resultBox = document.getElementById("uploadResult");
  const file = fileInput.files[0];

  if (!file) {
    resultBox.textContent = "Please select a video file first.";
    return;
  }

  resultBox.textContent = "Uploading...";

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_URL}/upload-video`, {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    resultBox.textContent = JSON.stringify(data);
  } catch (error) {
    resultBox.textContent = "Error: " + error.message;
  }
}

document.getElementById("testBackendBtn").addEventListener("click", testBackend);
document.getElementById("getClipsBtn").addEventListener("click", getClips);
document.getElementById("uploadBtn").addEventListener("click", uploadVideo);
