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

  fetch(reposURL)
    .then(response => response.json())
    .then(data => {
   let repoList = "<h3>Top Repositories:</h3><ul>";
data.slice(0, 6).forEach(repo => {
  repoList += `
    <li>
      <a href="${repo.html_url}" target="_blank">${repo.name}</a>
      <div class="repo-desc">
        ${repo.description || "No description provided."}
      </div>
      <div class="repo-stats">
        <span>⭐ ${repo.stargazers_count}</span>
        <span>📝 ${repo.language || "Unknown"}</span>
      </div>
    </li>
  `;
});
repoList += "</ul>";
document.getElementById("repos").innerHTML = repoList;

    })
    .catch(error => {
      console.log("Error fetching repos:", error);
    });
}
