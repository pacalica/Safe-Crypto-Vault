document.getElementById("confirmDeposit").addEventListener("click", () => {
  const amount = parseFloat(document.getElementById("depositAmount").value);
  const plan = document.getElementById("planSelect").value;

  const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  if (!user.email || !user.username) {
    alert("User not logged in.");
    window.location.href = "login.html";
    return;
  }

  if (!amount || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  const plans = {
    "1month": 3.5,
    "3months": 5.5,
    "5months": 7.5
  };

  const interest = plans[plan];
  const depositDate = new Date();
  const depositTimestamp = depositDate.getTime();

  const deposit = {
    email: user.email,
    username: user.username,
    amount,
    plan,
    interest,
    depositDate: depositDate.toLocaleDateString(),
    depositTime: depositDate.toLocaleTimeString(),
    timestamp: depositTimestamp,
    status: "pending"
  };

  // Salvează în istoric
  const deposits = JSON.parse(localStorage.getItem("deposits") || "[]");
  deposits.push(deposit);
  localStorage.setItem("deposits", JSON.stringify(deposits));

  // Salvează și în earnings
  const earnings = JSON.parse(localStorage.getItem("earnings") || "[]");
  earnings.push({
    email: user.email,
    amount,
    plan,
    interest,
    timestamp: depositTimestamp,
    earned: 0
  });
  localStorage.setItem("earnings", JSON.stringify(earnings));

  // Referral
  const refWallet = localStorage.getItem("refWallet");
  if (refWallet && refWallet !== user.wallet) {
    const referrals = JSON.parse(localStorage.getItem("referrals") || "[]");
    referrals.push({
      from: user.wallet,
      to: refWallet,
      level: 1,
      amount: amount * 0.02
    });
    localStorage.setItem("referrals", JSON.stringify(referrals));
  }

  // Trimite email
  fetch("https://formspree.io/f/xyyrddrw", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: "safecryptovault@gmail.com",
      subject: "💰 New Deposit Confirmed",
      message: `
        User: ${user.username} (${user.email})\n
        Amount: ${amount} USDT\n
        Plan: ${plan} (${interest}% interest)\n
        Date: ${depositDate.toLocaleDateString()} - ${depositDate.toLocaleTimeString()}
      `
    })
  });

  alert("Deposit submitted! You'll see it in History shortly.");
  window.location.href = "dashboard.html";
});
