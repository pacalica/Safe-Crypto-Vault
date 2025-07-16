// login.js

window.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('email');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');
  const rememberCheckbox = document.getElementById('rememberPassword');
  const loginForm = document.getElementById('loginForm');

  // 🧠 Auto-complete dacă există salvare
  if (localStorage.getItem('rememberPassword') === 'true') {
    emailInput.value = localStorage.getItem('email') || '';
    usernameInput.value = localStorage.getItem('username') || '';
    passwordInput.value = localStorage.getItem('password') || '';
    rememberCheckbox.checked = true;
  }

  // 👁️ Toggle vizibilitate parolă
  togglePassword.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePassword.textContent = isPassword ? '🙈' : '👁️';
  });

  // 📥 Login
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    // Salvare locală
    if (rememberCheckbox.checked) {
      localStorage.setItem('rememberPassword', 'true');
      localStorage.setItem('email', email);
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
    } else {
      localStorage.removeItem('rememberPassword');
      localStorage.removeItem('email');
      localStorage.removeItem('username');
      localStorage.removeItem('password');
    }

    // 🔐 Salvare pentru sesiune
    localStorage.setItem('user_email', email);
    localStorage.setItem('user_name', username);
    localStorage.setItem('user_logged_in', 'true');

    // Redirectare către aplicație
    window.location.href = 'dashboard.html';
  });
});
