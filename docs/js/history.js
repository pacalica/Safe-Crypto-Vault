document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("user_name");
  if (!username) {
    window.location.href = "login.html";
    return;
  }

  const historyTable = document.getElementById("historyTableBody");
  const withdrawals = JSON.parse(localStorage.getItem("withdrawals") || "[]");

  const userWithdrawals = withdrawals
    .filter(w => w.username === username)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (userWithdrawals.length === 0) {
    historyTable.innerHTML = `<tr><td colspan="3">No withdrawal history found.</td></tr>`;
    return;
  }

  userWithdrawals.forEach(entry => {
    const row = document.createElement("tr");
    const date = new Date(entry.date).toLocaleString();
    const amount = `${entry.amount} USDT`;
    const status = entry.status;

    let statusColor = "#ffcc00"; // pending
    if (status === "successful") statusColor = "#00ff99";
    if (status === "rejected") statusColor = "#ff4444";

    row.innerHTML = `
      <td>${date}</td>
      <td>${amount}</td>
      <td style="color:${statusColor}; font-weight: bold;">${status}</td>
    `;

    historyTable.appendChild(row);
  });
});
