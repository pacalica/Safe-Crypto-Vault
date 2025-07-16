document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("user_name");
  if (!user) return (window.location.href = "login.html");

  const referrals = JSON.parse(localStorage.getItem("referrals") || "[]");
  const withdrawals = JSON.parse(localStorage.getItem("withdrawals") || "[]");

  const level1 = referrals.filter(r => r.referrer === user);
  const level2 = referrals.filter(r =>
    level1.map(l1 => l1.username).includes(r.referrer)
  );

  const level1Table = document.querySelector("#level1Table tbody");
  const level2Table = document.querySelector("#level2Table tbody");
  const summary = document.getElementById("teamSummary");

  let earningsL1 = 0;
  let earningsL2 = 0;

  level1.forEach(l1 => {
    const totalWithdrawn = withdrawals
      .filter(w => w.username === l1.username && w.status === "successful")
      .reduce((sum, w) => sum + parseFloat(w.amount), 0);

    const commission = totalWithdrawn * 0.10;
    earningsL1 += commission;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${l1.username}</td>
      <td>${totalWithdrawn.toFixed(2)} USDT</td>
      <td>${commission.toFixed(2)} USDT</td>
    `;
    level1Table.appendChild(row);
  });

  level2.forEach(l2 => {
    const totalWithdrawn = withdrawals
      .filter(w => w.username === l2.username && w.status === "successful")
      .reduce((sum, w) => sum + parseFloat(w.amount), 0);

    const commission = totalWithdrawn * 0.05;
    earningsL2 += commission;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${l2.username}</td>
      <td>${totalWithdrawn.toFixed(2)} USDT</td>
      <td>${commission.toFixed(2)} USDT</td>
    `;
    level2Table.appendChild(row);
  });

  const totalEarnings = earningsL1 + earningsL2;

  summary.innerHTML = `
    <p><strong>Total Referrals:</strong> ${level1.length + level2.length}</p>
    <p><strong>Level 1 Earnings (10%):</strong> ${earningsL1.toFixed(2)} USDT</p>
    <p><strong>Level 2 Earnings (5%):</strong> ${earningsL2.toFixed(2)} USDT</p>
    <p><strong>Total Earnings:</strong> ${totalEarnings.toFixed(2)} USDT</p>
  `;
});
