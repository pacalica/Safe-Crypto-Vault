document.addEventListener("DOMContentLoaded", function () {
  // Inițializare EmailJS
  emailjs.init("7_PGCuxLtg1WCWvU0");

  const form = document.getElementById("withdrawForm");
  const message = document.getElementById("withdrawMessage");

  const username = localStorage.getItem("username") || "guest";
  const email = localStorage.getItem("email") || "unknown@nowhere.com";
  const wallet = localStorage.getItem("wallet") || "not connected";
  const total = parseFloat(localStorage.getItem("totalDeposit")) || 0;

  const history = JSON.parse(localStorage.getItem("withdrawHistory") || "[]");

  const hasPending = history.some(h => h.username === username && h.status === "Pending");

  if (hasPending) {
    message.innerText = "❌ Denied. You have a withdrawal request in pending.";
    form.style.display = "none";
    return;
  }

  if (total <= 0) {
    message.innerText = "❌ You must deposit before you can withdraw.";
    form.style.display = "none";
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById("amount").value);
    const method = document.getElementById("method").value;

    if (isNaN(amount) || amount <= 0) {
      message.innerText = "⚠️ Enter a valid withdrawal amount.";
      return;
    }

    if (amount > total) {
      message.innerText = `❌ You can't withdraw more than your balance (${total} USDT).`;
      return;
    }

    const now = new Date();
    const newRequest = {
      id: "wd_" + Math.random().toString(36).substring(2, 10),
      username,
      email,
      wallet,
      amount,
      method,
      status: "Pending",
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString()
    };

    history.push(newRequest);
    localStorage.setItem("withdrawHistory", JSON.stringify(history));
    message.innerText = "✅ Withdrawal request submitted.";
    form.reset();

    // Trimite email către administrator
    const emailParams = {
      to_email: "policagabrielvictor@gmail.com",
      username: username,
      email: email,
      wallet: wallet,
      amount: amount + " USDT",
      method: method,
      date: newRequest.date,
      time: newRequest.time,
      deposit_total: total + " USDT",
      request_id: newRequest.id
    };

    emailjs.send("service_mnaa5dl", "template_14vaz2e", emailParams)
      .then(res => {
        console.log("✅ Email retragere trimis administratorului:", res.status);
      })
      .catch(err => {
        console.error("❌ Eroare trimitere email retragere:", err);
      });
  });
});
