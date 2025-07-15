document.addEventListener("DOMContentLoaded", function () {
  const referrals = JSON.parse(localStorage.getItem("vault_referrals") || "[]");
  const history = JSON.parse(localStorage.getItem("vault_history") || "[]");

  let level1Total = 0;
  let level2Total = 0;

  const refList = document.getElementById("refList");
  const level1Earnings = document.getElementById("level1Earnings");
  const level2Earnings = document.getElementById("level2Earnings");
  const refCount = document.getElementById("refCount");

  // Simulăm structura: fiecare referral are { wallet, level, deposit }
  referrals.forEach(ref => {
    const li = document.createElement("li");
    li.textContent = `Wallet: ${ref.wallet} – Level ${ref.level} – Deposit: ${ref.deposit} BNB`;
    refList.appendChild(li);

    if (ref.level === 1) {
      level1Total += ref.deposit * 0.02;
    } else if (ref.level === 2) {
      level2Total += ref.deposit * 0.01;
    }
  });

  level1Earnings.textContent = level1Total.toFixed(4);
  level2Earnings.textContent = level2Total.toFixed(4);
  refCount.textContent = referrals.length;
});

function logout() {
  localStorage.clear();
}
