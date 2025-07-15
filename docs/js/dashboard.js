document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem("vault_username");
  const wallet = localStorage.getItem("vault_wallet") || "0x0000000000000000000000000000000000000000";
  const deposited = localStorage.getItem("vault_deposit") || "0";

  // Afișăm username-ul
  if (username) {
    document.getElementById("userName").textContent = username;
  } else {
    window.location.href = "login.html";
  }

  // Afișăm totalul investit
  document.getElementById("totalDeposited").textContent = deposited;

  // Generăm și afișăm linkul de referal
  const referralLink = `${window.location.origin}/login.html?ref=${wallet}`;
  const refInput = document.getElementById("refLink");
  refInput.value = referralLink;
});

function copyRef() {
  const input = document.getElementById("refLink");
  input.sel
