// Setează datele utilizatorului în pagina Dashboard
document.addEventListener("DOMContentLoaded", function () {
  // Obține datele din localStorage
  const username = localStorage.getItem("username") || "-";
  const email = localStorage.getItem("email") || "-";
  const wallet = localStorage.getItem("wallet") || "wallet";
  const totalDeposit = localStorage.getItem("totalDeposit") || "0";

  // Verifică dacă datele sunt valide, altfel redirecționează utilizatorul
  if (!username || !email || !wallet || totalDeposit === "0") {
    window.location.href = "index.html"; // Redirecționează utilizatorul către login dacă nu sunt date valide
    return; // Oprește execuția ulterioară
  }

  // Selectează elementele HTML pentru a le popula cu datele utilizatorului
  const userElem = document.getElementById("username");
  const emailElem = document.getElementById("email");
  const totalElem = document.getElementById("total");
  const referralElem = document.getElementById("referral");

  // Populează elementele HTML cu datele utilizatorului
  if (userElem) userElem.innerText = username;
  if (emailElem) emailElem.innerText = email;
  if (totalElem) totalElem.innerText = totalDeposit;
  if (referralElem) referralElem.innerText = `https://pacalica.github.io/Safe-Crypto-Vault/?ref=${wallet}`;
});

// Navigare între pagini
function goTo(page) {
  window.location.href = page;
}

// Logout: șterge toate datele din localStorage și redirecționează către login
function logout() {
  // Șterge datele de autentificare și alte informații din localStorage
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("wallet");
  localStorage.removeItem("totalDeposit");

  // Redirecționează utilizatorul la pagina de login
  window.location.href = "index.html"; 
}

// Verifică dacă utilizatorul este autentificat înainte de a accesa paginile protejate
window.addEventListener('DOMContentLoaded', () => {
  const email = localStorage.getItem('email');
  const username = localStorage.getItem('username');
  
  // Dacă nu există datele de autentificare, redirecționează utilizatorul la login
  if (!email || !username) {
    window.location.href = 'index.html';  // Redirecționează la login
  }
  
  // Dacă există datele de autentificare, populatează elementele cu informațiile utilizatorului
  document.getElementById('user-welcome').innerText = `Welcome, ${username}`;
  document.getElementById('user-deposit').innerText = `Your current deposit: 5000 USDT`;
  const referralLink = `https://safecryptovault.com?ref=${username}`;
  document.getElementById('referralLink').innerText = referralLink;
});

// Funcția pentru retragerea fondurilor
document.getElementById('withdrawForm').addEventListener('submit', function (e) {
  e.preventDefault();
  
  const amount = parseFloat(document.getElementById('amount').value);
  const method = document.getElementById('method').value;
  const address = document.getElementById('address').value.trim();
  const totalDeposit = 5000;  // Depozitul total este simulat

  const message = document.getElementById('withdrawMessage');
  
  // Debugging: Afișează informațiile introduse pentru retragere
  console.log('Amount:', amount);
  console.log('Method:', method);
  console.log('Address:', address);
  
  if (isNaN(amount) || amount <= 0) {
    message.innerText = "⚠️ Enter a valid withdrawal amount.";
    return;
  }

  if (amount > totalDeposit) {
    message.innerText = `❌ You can't withdraw more than your balance (${totalDeposit} USDT).`;
    return;
  }

  if (address === "") {
    message.innerText = "⚠️ Please enter a withdrawal address.";
    return;
  }

  // Adăugăm retragerea la istoricul retragerilor
  const history = JSON.parse(localStorage.getItem("withdrawHistory") || "[]");
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

  // Salvează cererea de retragere
  history.push(newRequest);
  localStorage.setItem("withdrawHistory", JSON.stringify(history));

  // Afișează mesaj de succes
  message.innerText = "✅ Withdrawal request submitted.";
  
  // Resetează formularul
  document.getElementById('withdrawForm').reset();

  // Trimite email administratorului
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
      console.log("✅ Withdrawal email sent to admin:", res.status);
    })
    .catch(err => {
      console.error("❌ Error sending withdrawal email:", err);
    });
});

// Adăugarea butonului "Back to Dashboard"
document.getElementById("backToDashboard").addEventListener("click", function() {
  goTo('dashboard.html'); // Navighează la dashboard
});
