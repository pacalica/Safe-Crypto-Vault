window.onload = () => {
  // Autocompletare dacă există date salvate
  document.getElementById('email').value = localStorage.getItem('email') || '';
  document.getElementById('username').value = localStorage.getItem('username') || '';
  const savedPass = localStorage.getItem('password');
  if (savedPass) {
    document.getElementById('password').value = atob(savedPass);
    document.getElementById('rememberPass').checked = true;
  }
};

function login() {
  const email = document.getElementById('email').value.trim();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const remember = document.getElementById('rememberPass').checked;

  // Validare email
  if (!email.includes('@') || !email.includes('.')) {
    alert('Please enter a valid email address.');
    return;
  }

  // Validare username
  if (username.length < 3) {
    alert('Username must be at least 3 characters.');
    return;
  }

  // Validare parolă
  if (password.length < 4) {
    alert('Password must be at least 4 characters.');
    return;
  }

  // Salvare în localStorage
  localStorage.setItem('email', email);
  localStorage.setItem('username', username);
  if (remember) {
    localStorage.setItem('password', btoa(password));
  } else {
    localStorage.removeItem('password');
  }

  // Redirecționare
  window.location.href = 'dashboard.html';
}
