document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("withdrawForm");
  const message = document.getElementById("withdrawMessage");

  const username = localStorage.getItem("username") || "guest";
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

    const newRequest = {
      username,
      amount,
      method,
      status: "Pending",
      date: new Date().toLocaleString()
    };

    history.push(newRequest);
    localStorage.setItem("withdrawHistory", JSON.stringify(history));
    message.innerText = "✅ Withdrawal request submitted.";
    form.reset();
  });
});
