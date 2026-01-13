/* ======================================================
   MODAL HANDLER (SHARED)
====================================================== */
function toggleModal(modal, open) {
  if (!modal) return;
  modal.style.display = open ? "flex" : "none";
  document.body.style.overflow = open ? "hidden" : "";
}

/* ======================================================
   WAITLIST MODAL
====================================================== */
const waitlistBtn = document.getElementById("waitlistBtn");
const waitlistModal = document.getElementById("waitlistModal");

if (waitlistBtn && waitlistModal) {
  waitlistBtn.addEventListener("click", () => {
    toggleModal(waitlistModal, true);
  });

  waitlistModal.addEventListener("click", (e) => {
    if (e.target === waitlistModal) {
      toggleModal(waitlistModal, false);
    }
  });
}

/* ======================================================
   WHATSAPP MODAL
====================================================== */
const openWhatsappBtn = document.getElementById("openWhatsappForm");
const whatsappModal = document.getElementById("whatsappModal");
const closeWhatsappBtn = document.getElementById("closeWhatsappForm");

if (openWhatsappBtn && whatsappModal && closeWhatsappBtn) {
  openWhatsappBtn.addEventListener("click", () => {
    toggleModal(whatsappModal, true);
  });

  closeWhatsappBtn.addEventListener("click", () => {
    toggleModal(whatsappModal, false);
  });

  whatsappModal.addEventListener("click", (e) => {
    if (e.target === whatsappModal) {
      toggleModal(whatsappModal, false);
    }
  });
}

/* ======================================================
   HERO PARALLAX (THROTTLED)
====================================================== */
const heroImage = document.querySelector(".hero-image img");
let rafId = null;

if (heroImage) {
  window.addEventListener("mousemove", (e) => {
    if (rafId) return;

    rafId = requestAnimationFrame(() => {
      const x = (window.innerWidth / 2 - e.clientX) / 40;
      const y = (window.innerHeight / 2 - e.clientY) / 40;
      heroImage.style.transform = `translate(${x}px, ${y}px)`;
      rafId = null;
    });
  });
}

/* ======================================================
   SCROLL BACKGROUND DEPTH
====================================================== */
const hero = document.querySelector(".hero");

if (hero) {
  window.addEventListener("scroll", () => {
    hero.style.setProperty("--bg-shift", `${window.scrollY * 0.15}px`);
  });
}

/* ======================================================
   SCROLL REVEAL (INTERSECTION OBSERVER)
====================================================== */
const revealElements = document.querySelectorAll(".reveal");

if (revealElements.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach(el => observer.observe(el));
}

/* ======================================================
   SEARCHABLE COUNTRY SELECTOR
====================================================== */
const selector = document.getElementById("countrySelector");
const selectedCountry = document.getElementById("selectedCountry");
const dropdown = document.getElementById("countryDropdown");

if (selector && selectedCountry && dropdown) {
  const searchInput = dropdown.querySelector(".country-search");
  const countryItems = dropdown.querySelectorAll(".country-list li");

  selectedCountry.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("active");
    if (searchInput) searchInput.value = "";
    filterCountries("");
  });

  countryItems.forEach(item => {
    item.addEventListener("click", () => {
      const label = item.getAttribute("data-label") || item.textContent.trim();
      selectedCountry.textContent = label;
      selectedCountry.dataset.code = item.dataset.code;
      dropdown.classList.remove("active");
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      filterCountries(e.target.value.toLowerCase());
    });
  }

  function filterCountries(query) {
    countryItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? "block" : "none";
    });
  }

  document.addEventListener("click", (e) => {
    if (!selector.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });
}

/* ======================================================
   PHONE INPUT – NUMBERS ONLY
====================================================== */
const phoneInput = document.querySelector(".phone-input");

if (phoneInput) {
  phoneInput.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, "");
  });
}

/* ======================================================
   WHATSAPP FORM SUBMIT (FIXED)
====================================================== */
const whatsappForm = document.querySelector(".whatsapp-form");

if (whatsappForm) {
  whatsappForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = whatsappForm.querySelector(".input-field").value.trim();
    const countryCode = selectedCountry?.dataset.code || "+965";
    const phone = document.querySelector(".phone-input")?.value.trim();

    if (!name || !phone) return;

    const payload = {
      name: name,
      phone: countryCode + phone
    };

    fetch(
      "https://script.google.com/macros/s/AKfycbxO9yHih_DOPqtVZEUCHoVNkqxQ6CLuzetow8W-_pakUmdw_0rg9zZ7vW5OOQDaBitH/exec",
      {
        method: "POST",
        body: JSON.stringify(payload)
      }
    )
      .then(res => res.json())
      .then(() => {
        const dialog = document.getElementById("successDialog");
        const closeBtn = document.getElementById("closeSuccessDialog");

        dialog.classList.add("active");
        launchConfetti();

        const autoClose = setTimeout(() => {
          dialog.classList.remove("active");
          toggleModal(whatsappModal, false);
          whatsappForm.reset();
        }, 2500);

        closeBtn.onclick = () => {
          clearTimeout(autoClose);
          dialog.classList.remove("active");
          toggleModal(whatsappModal, false);
          whatsappForm.reset();
        };
      })
      .catch(() => {
        const errorDialog = document.getElementById("errorDialog");
        const closeErrorBtn = document.getElementById("closeErrorDialog");

        errorDialog.classList.add("active");

        const autoClose = setTimeout(() => {
          errorDialog.classList.remove("active");
        }, 3000);

        closeErrorBtn.onclick = () => {
          clearTimeout(autoClose);
          errorDialog.classList.remove("active");
        };
      });
  });
}

/* ======================================================
   CONFETTI BURST
====================================================== */
function launchConfetti() {
  const container = document.getElementById("confettiContainer");
  if (!container) return;

  const CONFETTI_COUNT = 18;

  for (let i = 0; i < CONFETTI_COUNT; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.animationDelay = Math.random() * 0.3 + "s";
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

    container.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 2000);
  }
}

/* ======================================================
   MOBILE-ONLY JS ADDITIONS
====================================================== */

/* ---------- DETECT MOBILE ---------- */
const isMobile = window.matchMedia("(max-width: 900px)").matches;

/* ---------- DISABLE HERO PARALLAX ON MOBILE ---------- */
/* Reason: saves battery + avoids jank on low-end phones */
if (isMobile) {
  const heroImage = document.querySelector(".hero-image img");
  if (heroImage) {
    heroImage.style.transform = "none";
    window.onmousemove = null;
  }
}

/* ---------- PREVENT BACKGROUND SCROLL WHEN ANY MODAL IS OPEN ---------- */
/* (Mobile browsers are more aggressive with scroll bleed) */
const allModals = document.querySelectorAll(".modal");

allModals.forEach(modal => {
  if (!modal) return;

  const observer = new MutationObserver(() => {
    const isVisible = modal.style.display === "flex";
    document.body.style.overflow = isVisible ? "hidden" : "";
  });

  observer.observe(modal, { attributes: true, attributeFilter: ["style"] });
});

/* ---------- AUTO-FOCUS FIRST INPUT IN MODALS (MOBILE UX BOOST) ---------- */
function autoFocusModalInput(modalId) {
  if (!isMobile) return;

  const modal = document.getElementById(modalId);
  if (!modal) return;

  const input = modal.querySelector("input");
  if (!input) return;

  setTimeout(() => {
    input.focus();
  }, 300);
}

const waitlistBtnMobile = document.getElementById("waitlistBtn");
if (waitlistBtnMobile) {
  waitlistBtnMobile.addEventListener("click", () => {
    autoFocusModalInput("waitlistModal");
  });
}

const whatsappBtnMobile = document.getElementById("openWhatsappForm");
if (whatsappBtnMobile) {
  whatsappBtnMobile.addEventListener("click", () => {
    autoFocusModalInput("whatsappModal");
  });
}

/* ---------- ENSURE COUNTRY DROPDOWN DOES NOT OVERFLOW SCREEN ---------- */
if (isMobile) {
  const countryDropdown = document.getElementById("countryDropdown");
  if (countryDropdown) {
    countryDropdown.style.maxHeight = "220px";
    countryDropdown.style.overflowY = "auto";
  }
}

/* ---------- SOFT KEYBOARD FRIENDLY VIEWPORT FIX ---------- */
/* Prevents layout jump when keyboard opens on mobile */
if (isMobile) {
  const viewportHeight = window.innerHeight;
  window.addEventListener("resize", () => {
    if (window.innerHeight < viewportHeight * 0.75) {
      document.body.classList.add("keyboard-open");
    } else {
      document.body.classList.remove("keyboard-open");
    }
  });
}

/* ---------- TOUCH FRIENDLY BUTTON FEEDBACK ---------- */
if (isMobile) {
  document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("touchstart", () => {
      btn.style.transform = "scale(0.96)";
    });

    btn.addEventListener("touchend", () => {
      btn.style.transform = "";
    });
  });
}
