/* ======================================================
   MODAL HANDLER
====================================================== */
function toggleModal(modal, open) {
  modal.style.display = open ? "flex" : "none";
  document.body.style.overflow = open ? "hidden" : "";
}

/* WAITLIST MODAL */
const waitlistBtn = document.getElementById("waitlistBtn");
const waitlistModal = document.getElementById("waitlistModal");

if (waitlistBtn && waitlistModal) {
  waitlistBtn.onclick = () => toggleModal(waitlistModal, true);
  waitlistModal.onclick = (e) => {
    if (e.target === waitlistModal) toggleModal(waitlistModal, false);
  };
}

/* ======================================================
   WHATSAPP MODAL (FIXED)
====================================================== */
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

  whatsappModal.addEventListener("click", (e) => {
    if (e.target === whatsappModal) {
      whatsappModal.style.display = "none";
      document.body.style.overflow = "";
    }
  });
}

/* ======================================================
   HERO PARALLAX
====================================================== */
const heroImage = document.querySelector(".hero-image img");

if (heroImage) {
  window.addEventListener("mousemove", (e) => {
    const x = (window.innerWidth / 2 - e.clientX) / 40;
    const y = (window.innerHeight / 2 - e.clientY) / 40;
    heroImage.style.transform = `translate(${x}px, ${y}px)`;
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

/* ======================================================
   SEARCHABLE COUNTRY SELECTOR LOGIC (FIXED SAFELY)
====================================================== */
const selector = document.getElementById("countrySelector");
const selectedCountry = document.getElementById("selectedCountry");
const dropdown = document.getElementById("countryDropdown");
const searchInput = dropdown.querySelector(".country-search");
const countryItems = dropdown.querySelectorAll(".country-list li");

// Toggle dropdown
selectedCountry.addEventListener("click", () => {
  dropdown.classList.toggle("active");
  searchInput.value = "";
  filterCountries("");
});

// Select country  ✅ FIX HERE
countryItems.forEach(item => {
  item.addEventListener("click", () => {
    // Use explicit label instead of regex
    const label = item.getAttribute("data-label") 
      || item.textContent.trim();

    selectedCountry.textContent = label;
    selectedCountry.dataset.code = item.dataset.code;

    dropdown.classList.remove("active");
  });
});

// Search filter
searchInput.addEventListener("input", (e) => {
  filterCountries(e.target.value.toLowerCase());
});

function filterCountries(query) {
  countryItems.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(query) ? "block" : "none";
  });
}

// Close on outside click
document.addEventListener("click", (e) => {
  if (!selector.contains(e.target)) {
    dropdown.classList.remove("active");
  }
});

/* ======================================================
   FORM SUBMIT
====================================================== */
document.querySelector(".whatsapp-form").addEventListener("submit", (e) => {
  e.preventDefault();

  // Get form values
  const name = document.querySelector(".whatsapp-form input").value;
  const countryCode = selectedCountry.dataset.code || "+965";
  const phone = document.querySelector(".phone-input").value;

  // Prepare data for Google Sheets
  const payload = {
    name: name,
    phone: countryCode + phone
  };

  // SEND TO GOOGLE APPS SCRIPT
  fetch("https://script.google.com/macros/s/AKfycbxO9yHih_DOPqtVZEUCHoVNkqxQ6CLuzetow8W-_pakUmdw_0rg9zZ7vW5OOQDaBitH/exec", {
    method: "POST",
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(() => {
      const dialog = document.getElementById("successDialog");
      const closeBtn = document.getElementById("closeSuccessDialog");

      dialog.classList.add("active");
      launchConfetti();


      const autoClose = setTimeout(() => {
        dialog.classList.remove("active");
        whatsappModal.style.display = "none";
        document.body.style.overflow = "";
        e.target.reset();
      }, 2500);

      closeBtn.onclick = () => {
        clearTimeout(autoClose);
        dialog.classList.remove("active");
        whatsappModal.style.display = "none";
        document.body.style.overflow = "";
        e.target.reset();
      };
    })


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


/* ======================================================
   CONFETTI BURST
====================================================== */
function launchConfetti() {
  const container = document.getElementById("confettiContainer");
  if (!container) return;

  const CONFETTI_COUNT = 18; // subtle amount

  for (let i = 0; i < CONFETTI_COUNT; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.animationDelay = Math.random() * 0.3 + "s";
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

    container.appendChild(confetti);

    // cleanup
    setTimeout(() => {
      confetti.remove();
    }, 2000);
  }
}

/* ======================================================
   PHONE INPUT – NUMBERS ONLY
====================================================== */
const phoneInput = document.querySelector(".phone-input");

if (phoneInput) {
  phoneInput.addEventListener("input", () => {
    // Remove anything that is not a digit
    phoneInput.value = phoneInput.value.replace(/\D/g, "");
  });
}
