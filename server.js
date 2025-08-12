import express from "express";
import fetch from "node-fetch";  // If Node v18+, you can use built-in fetch
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend files from /public
app.use(express.static(path.join(__dirname, "public")));

// Helper function to call GitHub API
async function fetchGitHub(url) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`, // modern style
      "User-Agent": "DevConnect-App"
    }
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`GitHub API error (${res.status}): ${message}`);
  }

  return res.json();
}

// === API Endpoints ===

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

// Catch-all route → send index.html for any non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
