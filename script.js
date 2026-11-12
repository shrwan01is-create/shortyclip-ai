const API_URL = "https://shortyclip-ai.onrender.com";
document.getElementById('clip-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const url = document.getElementById('video-url').value.trim();
  const message = document.getElementById('form-message');

  if (!url) {
    message.textContent = 'Please paste a YouTube link.';
    return;
  }

  message.textContent =
    'Demo only: AI video processing is not connected yet. Clips cannot be generated right now.';
});async function testBackend() {
  const response = await fetch(`${API_URL}/`);
  const data = await response.json();
  console.log(data);
}
document.getElementById("testBackendBtn").addEventListener("click", testBackend);
