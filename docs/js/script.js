// ========== DASHBOARD & PROFIL USER ==========
document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");
  if (!user) {
    if (!window.location.href.includes("login.html") && !window.location.href.includes("register.html")) {
      window.location.href = "login.html";
    }
    return;
  }
  
  // --- Setare date user in dashboard/profil (daca exista elementele) ---
  if (document.getElementById("userName")) document.getElementById("userName").innerText = user.username || "-";
  if (document.getElementById("userEmail")) document.getElementById("userEmail").innerText = user.email || "-";
  if (document.getElementById("userLevel")) document.getElementById("userLevel").innerText = getUserLevel(user) || "1";
  if (document.getElementById("userDeposit")) document.getElementById("userDeposit").innerText = user.deposit || "0";
  
  // --- Referral link ---
  if (document.getElementById("referralLink")) {
    document.getElementById("referralLink").value = `${window.location.origin}/register.html?ref=${user.inviteCode}`;
  }

  // --- QR code for referral (if exists) ---
  if (document.getElementById("referralQR")) {
    new QRious({
      element: document.getElementById("referralQR"),
      value: `${window.location.origin}/register.html?ref=${user.inviteCode}`,
      size: 150
    });
  }
  
  // --- Planuri vizibile, dar inactive dacă userul nu are nivel ---
  updatePlansAccess(user);

  // --- Countdown la retragere (daca e pe pagina profil/retragere) ---
  if (document.getElementById("withdrawCountdown")) {
    showWithdrawCountdown(user);
  }

  // --- Bonus earnings update zilnic, inclusiv la invitați ---
  updateEarnings(user);

  // --- Bonus 10% din dobânda invitați zilnic ---
  updateReferralEarnings(user);
});

// ========== FUNCȚII SUPORT ==========

function getUserLevel(user) {
  // Regula de nivel: după număr invitați activi cu depunere minimă
  // Poate fi personalizată ușor dacă se schimbă planurile
  if (!user.referrals || user.referrals.length === 0) return 1;
  const activi = user.referrals.filter(r => r.active && r.deposit >= 100).length;
  if (activi >= 15) return 4;
  if (activi >= 7) return 3;
  if (activi >= 3) return 2;
  return 1;
}

function updatePlansAccess(user) {
  // Controlează accesul la planuri pe pagina de depunere
  const planBtns = document.querySelectorAll(".invest-plan-btn");
  if (planBtns.length === 0) return;
  const level = getUserLevel(user);
  planBtns.forEach((btn, idx) => {
    if (idx + 1 > level) {
      btn.disabled = true;
      btn.title = `Invite more active members to unlock this plan.`;
      btn.classList.add("plan-locked");
    } else {
      btn.disabled = false;
      btn.title = "";
      btn.classList.remove("plan-locked");
    }
  });
}

function showWithdrawCountdown(user) {
  // Afișează countdown până la următoarea retragere (o dată pe săptămână)
  const lastWithdraw = user.lastWithdraw ? new Date(user.lastWithdraw) : null;
  if (!lastWithdraw) {
    document.getElementById("withdrawCountdown").innerText = "You can withdraw now.";
    return;
  }
  const next = new Date(lastWithdraw.getTime() + 7 * 24 * 60 * 60 * 1000);
  const now = new Date();
  if (now >= next) {
    document.getElementById("withdrawCountdown").innerText = "You can withdraw now.";
    return;
  }
  const diff = next - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  document.getElementById("withdrawCountdown").innerText = `Next withdrawal in: ${days}d ${hours}h ${mins}m`;
}

function updateEarnings(user) {
  // Pentru fiecare depunere aprobată, calculează și afișează câștigul dobândă zilnic, adăugat la sold
  const deposits = JSON.parse(localStorage.getItem("deposits") || "[]").filter(d => d.wallet === user.wallet && d.status === "Approved");
  let totalEarnings = 0;
  deposits.forEach(dep => {
    const plan = getPlanForDeposit(dep);
    if (!plan) return;
    const approvedDate = new Date(dep.approvedDate || dep.date);
    const days = Math.floor((Date.now() - approvedDate.getTime()) / (1000 * 60 * 60 * 24));
    let earned = 0;
    for (let i = 1; i <= days; i++) {
      if (dep.amount > plan.max) break;
      earned += dep.amount * plan.dailyRate / 100;
    }
    dep.earned = earned;
    totalEarnings += earned;
  });
  // Afișează earnings pe pagină (dacă există)
  if (document.getElementById("totalEarnings")) {
    document.getElementById("totalEarnings").innerText = totalEarnings.toFixed(2) + " USDT";
  }
  // Update localStorage, dacă e nevoie
}

function getPlanForDeposit(dep) {
  // Definește planurile actuale conform ultimei cerințe
  const plans = [
    { name: "Plan 1", min: 1, max: 300, dailyRate: 1.5 },
    { name: "Plan 2", min: 1, max: 1500, dailyRate: 2.1 },
    { name: "Plan 3", min: 1, max: 4500, dailyRate: 2.3 },
    { name: "Plan 4", min: 1, max: 15000, dailyRate: 2.5 },
  ];
  // Decide pe baza nivelului și a sumei
  for (let i = plans.length - 1; i >= 0; i--) {
    if (dep.amount <= plans[i].max) return plans[i];
  }
  return null;
}

function updateReferralEarnings(user) {
  // Calculează și adaugă zilnic 10% din câștigul dobândă zilnică al invitaților direcți
  const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
  if (!user.referrals || user.referrals.length === 0) return;
  let totalReferralEarnings = 0;
  user.referrals.forEach(ref => {
    const invited = allUsers.find(u => u.inviteCode === ref.code);
    if (!invited) return;
    const deposits = JSON.parse(localStorage.getItem("deposits") || "[]")
      .filter(d => d.wallet === invited.wallet && d.status === "Approved");
    deposits.forEach(dep => {
      const plan = getPlanForDeposit(dep);
      if (!plan) return;
      const approvedDate = new Date(dep.approvedDate || dep.date);
      const days = Math.floor((Date.now() - approvedDate.getTime()) / (1000 * 60 * 60 * 24));
      let earned = 0;
      for (let i = 1; i <= days; i++) {
        if (dep.amount > plan.max) break;
        earned += dep.amount * plan.dailyRate / 100;
      }
      totalReferralEarnings += earned * 0.10;
    });
  });
  if (document.getElementById("totalReferralEarnings")) {
    document.getElementById("totalReferralEarnings").innerText = totalReferralEarnings.toFixed(2) + " USDT";
  }
}

// ========== LOGOUT ==========
function logout() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("rememberedUser");
  window.location.href = "login.html";
}

// ========== RETRAGERE ==========
const withdrawForm = document.getElementById('withdrawForm');
if (withdrawForm) {
  withdrawForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('amount').value);
    const method = document.getElementById('method').value;
    const address = document.getElementById('address').value.trim();
    const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");
    if (!user) return alert("Session expired.");
    const message = document.getElementById('withdrawMessage');
    if (isNaN(amount) || amount <= 0) {
      message.innerText = "⚠️ Enter a valid withdrawal amount.";
      return;
    }
    // Verifică dacă are dreptul să retragă
    if (amount > (user.earnings || 0)) {
      message.innerText = `❌ You can't withdraw more than your available earnings.`;
      return;
    }
    if (!address) {
      message.innerText = "⚠️ Please enter a withdrawal address.";
      return;
    }
    // countdown săptămânal
    if (user.lastWithdraw) {
      const last = new Date(user.lastWithdraw);
      if ((Date.now() - last.getTime()) < 7 * 24 * 60 * 60 * 1000) {
        message.innerText = "❌ Withdrawal allowed only once per week!";
        return;
      }
    }
    // Trimite la admin și salvează
    const now = new Date();
    const withdraw = {
      username: user.username,
      email: user.email,
      wallet: user.wallet,
      amount,
      method,
      address,
      status: "Pending",
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      request_id: "wd_" + Math.random().toString(36).substring(2, 10)
    };
    const history = JSON.parse(localStorage.getItem("withdrawHistory") || "[]");
    history.push(withdraw);
    localStorage.setItem("withdrawHistory", JSON.stringify(history));
    message.innerText = "✅ Withdrawal request submitted.";
    user.lastWithdraw = now.toISOString();
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    // Email către admin (folosește EmailJS sau alt serviciu)
    if (window.emailjs) {
      emailjs.send("service_mnaa5dl", "template_14vaz2e", {
        to_email: "policagabrielvictor@gmail.com",
        ...withdraw
      }).then(() => {
        console.log("Email sent to admin.");
      }).catch(console.error);
    }
    withdrawForm.reset();
  });
}

function goTo(page) {
  window.location.href = page;
}

// ===============================
// COPY referral (buton universal)
function copyReferral() {
  const refInput = document.getElementById("referralLink");
  refInput.select();
  refInput.setSelectionRange(0, 99999);
  document.execCommand("copy");
  if (document.getElementById("copyMsg")) document.getElementById("copyMsg").innerText = "Referral link copied!";
}

// ===============================
// (ALTE FUNCȚII UTILITARE SE POT ADĂUGA PE PAGINI NOI...)
