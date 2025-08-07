function getProfile() {
  const username = document.getElementById("usernameInput").value;
  const profileDiv = document.getElementById("profile");
  const reposDiv = document.getElementById("repos");

  if (!username) {
    profileDiv.classList.add('d-none');
    reposDiv.classList.add('d-none');
    return;
  }

  fetch(`https://api.github.com/users/${username}`)
    .then(response => {
      if (!response.ok) throw new Error("User not found");
      return response.json();
    })
    .then(data => {
      profileDiv.innerHTML = `
        <img src="${data.avatar_url}" alt="Avatar">
        <div class="profile-details">
          <h2>${data.name || data.login}</h2>
          <p>${data.bio || "No bio available."}</p>
          <p>📍 ${data.location || "Unknown location"}</p>
          <p>👥 Followers: ${data.followers} | Following: ${data.following}</p>
          <p>📦 Public Repos: ${data.public_repos}</p>
          <a href="${data.html_url}" target="_blank">Visit GitHub Profile</a>
        </div>
      `;
      profileDiv.classList.remove('d-none');
      getRepos(username);
    })
    .catch(() => {
      profileDiv.innerHTML = `<p class="text-danger">❌ User not found. Try again.</p>`;
      profileDiv.classList.remove('d-none');
      reposDiv.classList.add('d-none');
    });
}

function getRepos(username) {
  const reposDiv = document.getElementById("repos");

  fetch(`https://api.github.com/users/${username}/repos`)
    .then(response => response.json())
    .then(repos => {
      if (!Array.isArray(repos)) {
        reposDiv.innerHTML = "<p>No repositories found.</p>";
        return;
      }

      const topRepos = repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 3);

      reposDiv.innerHTML = `<h3>🔥 Top Repositories:</h3>` + topRepos.map(repo => `
        <div class="repo-card">
          <h5><a href="${repo.html_url}" target="_blank">${repo.name}</a> ⭐ ${repo.stargazers_count}</h5>
          <p>${repo.description || "No description provided."}</p>
        </div>
      `).join("");

      reposDiv.classList.remove('d-none');
    })
    .catch(() => {
      reposDiv.innerHTML = "<p class='text-danger'>Error loading repositories.</p>";
    });
}

// ===== Theme Toggle =====
const toggleButton = document.getElementById("themeToggle");

toggleButton.addEventListener("click", () => {
  const body = document.body;
  const icon = toggleButton.querySelector("i");

  body.classList.toggle("dark-mode");

  // Update icon
  if (body.classList.contains("dark-mode")) {
    icon.classList.remove("bi-moon-stars-fill");
    icon.classList.add("bi-brightness-high-fill");
    localStorage.setItem("theme", "dark");
  } else {
    icon.classList.remove("bi-brightness-high-fill");
    icon.classList.add("bi-moon-stars-fill");
    localStorage.setItem("theme", "light");
  }
});

// ===== Load saved theme on page load =====
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  const icon = toggleButton.querySelector("i");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    icon.classList.remove("bi-moon-stars-fill");
    icon.classList.add("bi-brightness-high-fill");
  }
});
