function getProfile() {
  const username = document.getElementById("usernameInput").value;
  const profileDiv = document.getElementById("profile");

  if (!username) {
    profileDiv.innerHTML = "<p>Please enter a GitHub username.</p>";
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
    <p>💼 Public Repos: ${data.public_repos}</p>
    <a href="${data.html_url}" target="_blank">Visit GitHub Profile</a>
  </div>
`;
      // ✅ Call getRepos here after successful profile fetch
      getRepos(username);
    })
    .catch(error => {
      profileDiv.innerHTML = `<p>User not found. Try again.</p>`;
    });
}

function getRepos(username) {
  const reposURL = `https://api.github.com/users/${username}/repos`;
  const reposDiv = document.getElementById("repos");

  fetch(reposURL)
    .then(response => response.json())
    .then(repos => {
      if (!Array.isArray(repos)) {
        reposDiv.innerHTML = "<p>No repositories found.</p>";
        return;
      }

      // Sort by stars descending and take top 3
      const topRepos = repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 3);

      reposDiv.innerHTML = `<h3>Top Repositories:</h3>` + topRepos.map(repo => `
        <div class="repo-card">
          <h4><a href="${repo.html_url}" target="_blank">${repo.name}</a> ⭐ ${repo.stargazers_count}</h4>
          <p>${repo.description || "No description provided."}</p>
        </div>
      `).join("");
    })
    .catch(error => {
      reposDiv.innerHTML = "<p>Error loading repositories.</p>";
    });
}

