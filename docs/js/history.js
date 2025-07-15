document.addEventListener("DOMContentLoaded", function () {
  const history = JSON.parse(localStorage.getItem("vault_history") || "[]");
  const table = document.getElementById("historyTable");

  if (history.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="4">No transactions found.</td>`;
    table.appendChild(row);
    return;
  }

  history.forEach(entry => {
    const row = document.createElement("tr");

    const typeCell = document.createElement("td");
    typeCell.textContent = entry.type;

    const amountCell = document.createElement("td");
    amountCell.textContent = entry.amount.toFixed(4);

    const dateCell = document.createElement("td");
    const d = new Date(entry.date);
    dateCell.textContent = d.toLocaleString();

    const statusCell = document.createElement("td");
    statusCell.textContent = entry.status;
    statusCell.className = `status-${entry.status}`;

    row.appendChild(typeCell);
    row.appendChild(amountCell);
    row.appendChild(dateCell);
    row.appendChild(statusCell);

    table.appendChild(row);
  });
});

function logout() {
  localStorage.clear();
}
