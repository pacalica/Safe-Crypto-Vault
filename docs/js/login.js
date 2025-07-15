document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");

  // Verificare autologin
  const savedEmail = localStorage.getItem("vault_email");
  const savedUsername = localStorage.getItem("vault_username");
  if (savedEmail && savedUsername) {
    window.location.href = "dashboard.html";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();

    if (email && username) {
      localStorage.setItem("vault_email", email);
      localStorage.setItem("vault_username", username);
      window.location.href = "dashboard.html";
    }
  });
});
