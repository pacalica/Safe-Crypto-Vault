// withdraw.js

document.addEventListener("DOMContentLoaded", () => {
  const emailSpan = document.getElementById("email");
  const usernameSpan = document.getElementById("username");
  const form = document.getElementById("withdraw-form");
  const messageBox = document.getElementById("message");

  // Afișare user info
  const email = localStorage.getItem("email") || "-";
  const username = localStorage.getItem("username") || "-";
  emailSpan.innerText = email;
  usernameSpan.innerText = username;

  // Verificare dacă există o cerere pending
  const existingRequest = JSON.parse(localStorage.getItem("withdrawRequest"));

  if (existingRequest && existingRequest.status === "pending") {
    messageBox.innerText = "❌ Denied. You have a withdrawal request in pending.";
    form.style.display = "none";
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const amount = parseFloat(document.getElementById("amount").value);
    const wallet = document.getElementById("wallet").value;
    const plan = document.getElementById("plan").value;

    if (!amount || !wallet) {
      messageBox.innerText = "❗Please fill in all fields.";
      return;
    }

    const request = {
      email,
      username,
      amount,
      wallet,
      plan,
      date: new Date().toLocaleString(),
      status: "pending",
    };

    // Salvare în withdrawRequest
    localStorage.setItem("withdrawRequest", JSON.stringify(request));

    // Salvare în istoric
    const history = JSON.parse(localStorage.getItem("withdrawHistory")) || [];
    history.push(request);
    localStorage.setItem("withdrawHistory", JSON.stringify(history));

    messageBox.innerText = "✅ Withdrawal request submitted.";
    form.style.display = "none";
  });
});
