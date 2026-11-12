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

document.getElementById("testBackendBtn").addEventListener("click", testBackend);

document.getElementById("getClipsBtn").addEventListener("click", async () => {
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
});
