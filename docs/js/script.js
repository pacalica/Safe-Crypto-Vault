// Setează datele utilizatorului în pagina Dashboard
document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem("username") || "-";
  const email = localStorage.getItem("email") || "-";
  const wallet = localStorage.getItem("wallet") || "wallet";
  const totalDeposit = localStorage.getItem("totalDeposit") || "0";

  const userElem = document.getElementById("username");
  const emailElem = document.getElementById("email");
  const totalElem = document.getElementById("total");
  const referralElem = document.getElementById("referral");

  if (userElem) userElem.innerText = username;
  if (emailElem) emailElem.innerText = email;
  if (totalElem) totalElem.innerText = totalDeposit;
  if (referralElem) referralElem.innerText = `https://pacalica.github.io/Safe-Crypto-Vault/?ref=${wallet}`;
});

// Navigare între pagini
function goTo(page) {
  window.location.href = page;
}

// Logout: șterge toate datele și redirecționează către login
function logout() {
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("wallet");
  localStorage.removeItem("totalDeposit");
  window.location.href = "index.html";
}

// Poți extinde acest fișier și cu alte funcții globale pentru aplicație,
// de exemplu funcții de validare, alertă, etc.
