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

  // --- Păstrează și wallet și adresa de retragere dacă există! ---
  const userWallet = user.wallet || ""; // dacă ai wallet la user
  const userWithdrawalAddress = user.withdrawalAddress || ""; // dacă ai adăugat logică de salvare retragere la user
  const userRef = user.ref || (localStorage.getItem("refWallet") || "");

  const deposit = {
    email: user.email,
    username: user.username,
    wallet: userWallet,
    amount,
    plan,
    interest,
    depositDate: depositDate.toLocaleDateString(),
    depositTime: depositDate.toLocaleTimeString(),
    timestamp: depositTimestamp,
    status: "pending",
    withdrawalAddress: userWithdrawalAddress,  // pentru a ști unde poate fi plătit și la confirmare
    ref: userRef
    // adminNote și approvedAmount vor fi completate de admin la aprobare!
  };

  // Salvează în istoric
  const deposits = JSON.parse(localStorage.getItem("deposits") || "[]");
  deposits.push(deposit);
  localStorage.setItem("deposits", JSON.stringify(deposits));

  // Salvează și în earnings (poți extinde după nevoie)
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
  if (userRef && userRef !== user.wallet) {
    const referrals = JSON.parse(localStorage.getItem("referrals") || "[]");
    referrals.push({
      from: user.wallet,
      to: userRef,
      level: 1,
      amount: amount * 0.02
    });
    localStorage.setItem("referrals", JSON.stringify(referrals));
  }

  // Trimite email la admin (poate include și adresa retragere, ref etc)
  fetch("https://formspree.io/f/xyyrddrw", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: "safecryptovault@gmail.com",
      subject: "💰 New Deposit Confirmed",
      message: `
        User: ${user.username} (${user.email})
        Wallet: ${userWallet}
        Amount: ${amount} USDT
        Plan: ${plan} (${interest}% interest)
        Date: ${depositDate.toLocaleDateString()} - ${depositDate.toLocaleTimeString()}
        Withdrawal address: ${userWithdrawalAddress}
        Referrer: ${userRef}
      `
    })
  });

  alert("Deposit submitted! You'll see it in History shortly.");
  window.location.href = "dashboard.html";
});
