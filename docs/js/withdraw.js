document.addEventListener("DOMContentLoaded", function () {
  const history = JSON.parse(localStorage.getItem("vault_history") || "[]");

  const hasPending = history.some(tx => tx.type === "withdraw" && tx.status === "pending");

  if (hasPending) {
    document.getElementById("withdrawForm").classList.add("hidden");
    document.getElementById("pendingMessage").classList.remove("hidden");
  }
});

function submitWithdraw() {
  const amount = parseFloat(document.getElementById("withdrawAmount").value);

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  const history = JSON.parse(localStorage.getItem("vault_history") || "[]");

  // Verificăm dacă există deja o cerere pending
  const hasPending = history.some(tx => tx.type === "withdraw" && tx.status === "pending");
  if (hasPending) {
    alert("You already have a pending withdrawal request.");
    return;
  }

  // Salvăm cererea în istoric
  history.push({
    type: "withdraw",
    amount: amount,
    date: new Date().toISOString(),
    status: "pending"
  });

  localStorage.setItem("vault_history", JSON.stringify(history));

  alert("Withdrawal request submitted!");
  window.location.href = "history.html";
}

function logout() {
  localStorage.clear();
}
