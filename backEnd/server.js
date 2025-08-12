import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Allow frontend files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../public")));

// Fetch helper
async function fetchGitHub(url) {
  const res = await fetch(url, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` }
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

// Profile endpoint
app.get("/api/profile/:username", async (req, res) => {
  try {
    const data = await fetchGitHub(`https://api.github.com/users/${req.params.username}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Repos endpoint
app.get("/api/repos/:username", async (req, res) => {
  try {
    const data = await fetchGitHub(`https://api.github.com/users/${req.params.username}/repos`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
