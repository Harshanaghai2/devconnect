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
        <img src="${data.avatar_url}" alt="Avatar" width="100" style="border-radius:50%;">
        <h2>${data.name || data.login}</h2>
        <p>${data.bio || "No bio available."}</p>
        <p>📍 ${data.location || "Unknown location"}</p>
        <p>💼 Public Repos: ${data.public_repos}</p>
        <a href="${data.html_url}" target="_blank">Visit GitHub Profile</a>
      `;
    })
    .catch(error => {
      profileDiv.innerHTML = `<p>User not found. Try again.</p>`;
    });
}
