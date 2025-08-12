// === Theme Toggle with Memory ===
const themeToggle = document.getElementById("themeToggle");

// Load saved theme from localStorage
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.textContent = "☀️";
} else {
  themeToggle.textContent = "🌙";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// === Show & Hide Loading Spinner ===
function showLoading() {
  document.getElementById("loading").classList.remove("d-none");
}
function hideLoading() {
  document.getElementById("loading").classList.add("d-none");
}

// Helper: Fetch from Backend API
function fetchFromBackend(endpoint) {
  return fetch(endpoint);
}

// === Fetch GitHub Profile via Backend ===
function getProfile() {
  const username = document.getElementById("usernameInput").value.trim();
  const profileDiv = document.getElementById("profile");
  const reposDiv = document.getElementById("repos");

  if (!username) {
    profileDiv.classList.add("d-none");
    reposDiv.classList.add("d-none");
    return;
  }

  showLoading();

  fetchFromBackend(`/api/profile/${username}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("User not found or API error");
      }
      return response.json();
    })
    .then(data => {
      hideLoading();
      profileDiv.innerHTML = `
        <img src="${data.avatar_url}" alt="Avatar">
        <div class="profile-details">
          <h2>${data.name || data.login}</h2>
          <p>${data.bio || "No bio available."}</p>
          <p>📍 ${data.location || "Unknown location"}</p>
          <p>📅 Joined: ${new Date(data.created_at).toLocaleDateString()}</p>
          ${data.blog ? `<p>🔗 <a href="${data.blog}" target="_blank">${data.blog}</a></p>` : ""}
          <p>👥 Followers: ${data.followers} | Following: ${data.following}</p>
          <p>📦 Public Repos: ${data.public_repos}</p>
          <a href="${data.html_url}" target="_blank">${data.login}</a>
        </div>
      `;
      profileDiv.classList.remove("d-none");
      getRepos(username);
    })
    .catch(err => {
      hideLoading();
      profileDiv.innerHTML = `<p class="text-danger">❌ ${err.message}</p>`;
      profileDiv.classList.remove("d-none");
      reposDiv.classList.add("d-none");
    });
}

// === Show More / Show Less Repositories Feature ===
let displayedRepoCount = 3;
let allRepos = [];

function getRepos(username) {
  const reposDiv = document.getElementById("repos");

  fetchFromBackend(`/api/repos/${username}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Unable to fetch repositories.");
      }
      return response.json();
    })
    .then(repos => {
      if (!Array.isArray(repos) || repos.length === 0) {
        reposDiv.innerHTML = "<p>No repositories found.</p>";
        reposDiv.classList.remove("d-none");
        return;
      }

      // Store sorted repositories
      allRepos = repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
      displayedRepoCount = 3; // Reset count on each new search
      renderRepos();
    })
    .catch(err => {
      reposDiv.innerHTML = `<p class='text-danger'>${err.message}</p>`;
      reposDiv.classList.remove("d-none");
    });
}

function renderRepos() {
  const reposDiv = document.getElementById("repos");

  // Get only repos to be displayed
  const reposToShow = allRepos.slice(0, displayedRepoCount);

  // Repo card HTML
  const reposHtml = reposToShow.map(repo => `
    <div class="repo-card">
      <h5><a href="${repo.html_url}" target="_blank">${repo.name}</a> ⭐ ${repo.stargazers_count}</h5>
      <p>${repo.description || "No description provided."}</p>
    </div>
  `).join("");

  // Show More / Less button if more than 3 repos in total
  let buttonHtml = "";
  if (allRepos.length > 3) {
    buttonHtml = `
      <button id="toggleReposBtn" class="btn btn-outline-primary mt-3">
        ${displayedRepoCount < allRepos.length ? "Show More" : "Show Less"}
      </button>
    `;
  }

  reposDiv.innerHTML = `<h3>🔥 Top Repositories:</h3>${reposHtml}${buttonHtml}`;
  reposDiv.classList.remove("d-none");

  // Button functionality
  const toggleBtn = document.getElementById("toggleReposBtn");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      if (displayedRepoCount < allRepos.length) {
        displayedRepoCount = Math.min(displayedRepoCount + 3, allRepos.length);
      } else {
        displayedRepoCount = 3;
        window.scrollTo({ top: reposDiv.offsetTop, behavior: 'smooth' });
      }
      renderRepos();
    });
  }
}
