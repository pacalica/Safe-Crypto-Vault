// Încarcă librăria EmailJS din CDN
(function () {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js";
  script.onload = () => {
    emailjs.init("7_PGCuxLtg1WCWvU0"); // Public Key
    console.log("✅ EmailJS initialized.");
  };
  document.head.appendChild(script);
})();
