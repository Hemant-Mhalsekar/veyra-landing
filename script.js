/* =========================
   HERO WAITLIST MODAL
========================= */

const waitlistBtn = document.getElementById("waitlistBtn");
const waitlistModal = document.getElementById("waitlistModal");
const waitlistCloseBtn = waitlistModal?.querySelector(".close");
const hero = document.querySelector(".hero");

if (waitlistBtn && waitlistModal && waitlistCloseBtn) {
  waitlistBtn.addEventListener("click", () => {
    waitlistModal.style.display = "flex";
    document.body.style.overflow = "hidden";
  });

  waitlistCloseBtn.addEventListener("click", () => {
    waitlistModal.style.display = "none";
    document.body.style.overflow = "";
  });

  window.addEventListener("click", (e) => {
    if (e.target === waitlistModal) { 
      waitlistModal.style.display = "none";
      document.body.style.overflow = "";
    }
  });
}

/* =========================
   SCROLL BACKGROUND DEPTH
========================= */

if (hero) {
  window.addEventListener("scroll", () => {
    hero.style.setProperty("--bg-shift", `${window.scrollY * 0.15}px`);
  });
}

/* =========================
   SNACK PROBLEM ANIMATION
========================= */

document.querySelectorAll(".problem-item").forEach((item, index) => {
  item.style.opacity = "0";
  item.style.transform = "translateY(20px)";

  setTimeout(() => {
    item.style.transition = "all 0.6s ease";
    item.style.opacity = "1";
    item.style.transform = "translateY(0)";
  }, index * 200);
});

/* =========================
   USE CASES ANIMATION
========================= */

document.querySelectorAll(".use-card, .fruit-side").forEach((el, i) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(20px)";

  setTimeout(() => {
    el.style.transition = "all 0.6s ease";
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  }, i * 120);
});

/* =========================
   WHATSAPP FORM MODAL
========================= */

const openWhatsappBtn = document.getElementById("openWhatsappForm");
const whatsappModal = document.getElementById("whatsappModal");
const closeWhatsappBtn = document.getElementById("closeWhatsappForm");

if (openWhatsappBtn && whatsappModal && closeWhatsappBtn) {
  openWhatsappBtn.addEventListener("click", () => {
    whatsappModal.style.display = "flex";
    document.body.style.overflow = "hidden";
  });

  closeWhatsappBtn.addEventListener("click", () => {
    whatsappModal.style.display = "none";
    document.body.style.overflow = "";
  });

  window.addEventListener("click", (e) => {
    if (e.target === whatsappModal) {
      whatsappModal.style.display = "none";
      document.body.style.overflow = "";
    }
  });
}
