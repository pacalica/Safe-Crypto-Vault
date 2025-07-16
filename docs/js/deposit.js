document.addEventListener("DOMContentLoaded", function () {
  // Dacă există referal în URL, îl salvăm
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get("ref");
  if (ref) {
    localStorage.setItem("vault_ref", ref);
  }

  // Inițializare EmailJS
  emailjs.init("7_PGCuxLtg1WCWvU0");
});

function copyAddress() {
  const addressInput = document.getElementById("depositAddress");
  addressInput.select();
  addressInput.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("Deposit address copied!");
}

function confirmDeposit() {
  const amount = parseFloat(document.getElementById("amountSent").value);
  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  const user = JSON.parse(localStorage.getItem("userData"));
  if (!user || !user.email || !user.username) {
    alert("User data missing. Please log in again.");
    return;
  }

  // Salvăm suma totală investită
  localStorage.setItem("vault_deposit", amount.toString());

  // Simulăm salvarea într-un istoric local
  const history = JSON.parse(localStorage.getItem("vault_history") || "[]");
  history.push({
    type: "deposit",
    amount: amount,
    date: new Date().toISOString(),
    status: "confirmed"
  });
  localStorage.setItem("vault_history", JSON.stringify(history));

  // Trimite email către administrator
  const emailParams = {
    to_email: "policagabrielvictor@gmail.com",  // Email-ul tău de admin
    username: user.username,
    amount: amount,
    tx_hash: "manual"
  };

  emailjs.send("service_mnaa5dl", "template_2pbn9v4", emailParams)
    .then(res => {
      console.log("✅ Email de depunere trimis către admin:", res.status);
    })
    .catch(err => {
      console.error("❌ Eroare trimitere email depunere:", err);
    });

  alert("✅ Deposit saved. Redirecting to dashboard...");
  window.location.href = "dashboard.html";
}

function logout() {
  localStorage.clear();
}
