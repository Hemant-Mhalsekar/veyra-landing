/* ======================================================
   SHARED WAITLIST SCROLL ELEMENTS (DECLARE ONCE)
====================================================== */
const emailWaitlistSection = document.getElementById("email-waitlist");
const emailInput = document.getElementById("emailWaitlistInput");

/* ======================================================
   MODAL HANDLER (SHARED)
====================================================== */
function toggleModal(modal, open) {
  if (!modal) return;
  modal.style.display = open ? "flex" : "none";
  document.body.style.overflow = open ? "hidden" : "";
}

/* ======================================================
   SCROLL + AUTO-FOCUS EMAIL WAITLIST (SHARED FUNCTION)
====================================================== */
const waitlistBtn = document.getElementById("waitlistBtn");
const earlyAccessScrollBtn = document.getElementById("earlyAccessScrollBtn");

function scrollToEmailWaitlist() {
  if (!emailWaitlistSection) return;

  emailWaitlistSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  if (emailInput) {
    setTimeout(() => {
      emailInput.focus();
      emailInput.classList.add("email-glow");

      setTimeout(() => {
        emailInput.classList.remove("email-glow");
      }, 1600);
    }, 600);
  }
}

if (waitlistBtn) {
  waitlistBtn.addEventListener("click", (e) => {
    e.preventDefault();
    scrollToEmailWaitlist();
  });
}

if (earlyAccessScrollBtn) {
  earlyAccessScrollBtn.addEventListener("click", (e) => {
    e.preventDefault();
    scrollToEmailWaitlist();
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
   SCROLL REVEAL (DIRECTION-BASED + REPEATABLE)
====================================================== */
const revealElements = document.querySelectorAll(".reveal");

let lastScrollY = window.scrollY;
let scrollDirection = "down";

window.addEventListener("scroll", () => {
  if (window.scrollY > lastScrollY) {
    scrollDirection = "down";
  } else {
    scrollDirection = "up";
  }
  lastScrollY = window.scrollY;
});

if (revealElements.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {

          // remove old direction classes
          entry.target.classList.remove("from-up", "from-down");

          // apply direction
          if (scrollDirection === "down") {
            entry.target.classList.add("from-down");
          } else {
            entry.target.classList.add("from-up");
          }

          // trigger animation
          requestAnimationFrame(() => {
            entry.target.classList.add("active");
          });

        } else {
          entry.target.classList.remove("active");
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px" // mobile-friendly
    }
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
   WHATSAPP FORM SUBMIT
====================================================== */
const whatsappForm = document.querySelector(".whatsapp-form");

if (whatsappForm) {
  whatsappForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = whatsappForm.querySelector(".input-field").value.trim();
    const countryCode = selectedCountry?.dataset.code || "+965";
    const phone = document.querySelector(".phone-input")?.value.trim();

    if (!name || !phone) return;

    fetch(
      "https://script.google.com/macros/s/AKfycbxamsuAn-GftmJxzgYXwVhrId6AG4gqcrVM-91Yc8bw6piR3dhMPXGiuZHGEI5zAXRA/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
        body: JSON.stringify({
          name: name,
          phone: countryCode + phone
        })
      }
    );

    const dialog = document.getElementById("successDialog");
    const closeBtn = document.getElementById("closeSuccessDialog");

    dialog.classList.add("active");
    launchConfetti();

    const autoClose = setTimeout(() => {
      dialog.classList.remove("active");
      toggleModal(whatsappModal, false);
      whatsappForm.reset();
    }, 4500);

    closeBtn.onclick = () => {
      clearTimeout(autoClose);
      dialog.classList.remove("active");
      toggleModal(whatsappModal, false);
      whatsappForm.reset();
    };
  });
}

/* ======================================================
   EMAIL WAITLIST SUBMIT
====================================================== */
const emailForm = document.querySelector(".email-form");

if (emailForm && emailInput) {
  emailForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    if (!email) return;

    fetch(
      "https://script.google.com/macros/s/AKfycbxamsuAn-GftmJxzgYXwVhrId6AG4gqcrVM-91Yc8bw6piR3dhMPXGiuZHGEI5zAXRA/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
        body: JSON.stringify({ email })
      }
    );

    const dialog = document.getElementById("successDialog");
    const closeBtn = document.getElementById("closeSuccessDialog");

    dialog.classList.add("active");
    launchConfetti();

    emailInput.value = "";

    const autoClose = setTimeout(() => {
      dialog.classList.remove("active");
    }, 4500);

    closeBtn.onclick = () => {
      clearTimeout(autoClose);
      dialog.classList.remove("active");
    };
  });
}

/* ======================================================
   CONFETTI
====================================================== */
function launchConfetti() {
  const container = document.getElementById("confettiContainer");
  if (!container) return;

  const CONFETTI_COUNT = 25;

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
