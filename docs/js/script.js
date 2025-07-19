// Setează datele utilizatorului în pagina Dashboard (dacă există elementele)
document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem("username") || "-";
  const email = localStorage.getItem("email") || "-";
  const wallet = localStorage.getItem("wallet") || "wallet";
  const totalDeposit = localStorage.getItem("totalDeposit") || "0";

  // Populează dashboard-ul dacă elementele există
  const userElem = document.getElementById("username");
  const emailElem = document.getElementById("email");
  const totalElem = document.getElementById("total");
  const referralElem = document.getElementById("referral");

  if (userElem) userElem.innerText = username;
  if (emailElem) emailElem.innerText = email;
  if (totalElem) totalElem.innerText = totalDeposit;
  if (referralElem) referralElem.innerText = `https://pacalica.github.io/Safe-Crypto-Vault/?ref=${wallet}`;

  // Populează pagina principală dacă există aceste elemente
  const welcomeElem = document.getElementById('user-welcome');
  const depositElem = document.getElementById('user-deposit');
  const referralLinkElem = document.getElementById('referralLink');

  if (welcomeElem) welcomeElem.innerText = `Welcome, ${username}`;
  if (depositElem) depositElem.innerText = `Your current deposit: ${totalDeposit} USDT`;
  if (referralLinkElem) referralLinkElem.innerText = `https://pacalica.github.io/Safe-Crypto-Vault/?ref=${wallet}`;
});

// Navigare între pagini
function goTo(page) {
  window.location.href = page;
}

// Logout
function logout() {
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("wallet");
  localStorage.removeItem("totalDeposit");
  window.location.href = "index.html";
}

// Verificare login pentru paginile protejate
window.addEventListener("DOMContentLoaded", () => {
  const email = localStorage.getItem("email");
  const username = localStorage.getItem("username");

  // Dacă utilizatorul nu este logat, redirecționează către login
  if (!email || !username) {
    if (!window.location.href.includes("index.html")) {
      window.location.href = "index.html";
    }
  }
});

// ===============================
// Retragere fonduri (Withdraw)
// ===============================
const withdrawForm = document.getElementById('withdrawForm');
if (withdrawForm) {
  withdrawForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);
    const method = document.getElementById('method').value;
    const address = document.getElementById('address').value.trim();
    const totalDeposit = parseFloat(localStorage.getItem("totalDeposit")) || 0;
    const message = document.getElementById('withdrawMessage');

    if (isNaN(amount) || amount <= 0) {
      message.innerText = "⚠️ Enter a valid withdrawal amount.";
      return;
    }

    if (amount > totalDeposit) {
      message.innerText = `❌ You can't withdraw more than your balance (${totalDeposit} USDT).`;
      return;
    }

    if (!address) {
      message.innerText = "⚠️ Please enter a withdrawal address.";
      return;
    }

    const now = new Date();
    const newRequest = {
      id: "wd_" + Math.random().toString(36).substring(2, 10),
      username: localStorage.getItem('username'),
      email: localStorage.getItem('email'),
      wallet: localStorage.getItem('wallet'),
      amount,
      method,
      address,
      status: "Pending",
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString()
    };

    const history = JSON.parse(localStorage.getItem("withdrawHistory") || "[]");
    history.push(newRequest);
    localStorage.setItem("withdrawHistory", JSON.stringify(history));
    message.innerText = "✅ Withdrawal request submitted.";
    withdrawForm.reset();

    // Email administrator
    const emailParams = {
      to_email: "policagabrielvictor@gmail.com",
      username: newRequest.username,
      email: newRequest.email,
      wallet: newRequest.wallet,
      amount: amount + " USDT",
      method: method,
      address: address,
      date: newRequest.date,
      time: newRequest.time,
      request_id: newRequest.id
    };

    emailjs.send("service_mnaa5dl", "template_14vaz2e", emailParams)
      .then(res => {
        console.log("✅ Email sent to admin:", res.status);
      })
      .catch(err => {
        console.error("❌ Email error:", err);
      });
  });
}

// ===============================
// Buton "Back to Dashboard"
// ===============================
const backBtn = document.getElementById("backToDashboard");
if (backBtn) {
  backBtn.addEventListener("click", function () {
    goTo("dashboard.html");
  });
}
