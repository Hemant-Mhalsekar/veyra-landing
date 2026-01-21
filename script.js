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
   HERO CTA → SCROLL ONLY (FINAL & CLEAN)
====================================================== */
const waitlistBtn = document.getElementById("waitlistBtn");

if (waitlistBtn && emailWaitlistSection) {
  waitlistBtn.addEventListener("click", (e) => {
    e.preventDefault();

    emailWaitlistSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
}


/* ======================================================
   SCROLL + AUTO-FOCUS EMAIL WAITLIST (UNCHANGED)
====================================================== */
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

if (earlyAccessScrollBtn) {
  earlyAccessScrollBtn.addEventListener("click", (e) => {
    e.preventDefault();
    scrollToEmailWaitlist();
  });
}

/* ======================================================
   WHATSAPP MODAL (UNCHANGED)
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
   HERO PARALLAX (UNCHANGED)
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
   SCROLL BACKGROUND DEPTH (UNCHANGED)
====================================================== */
const hero = document.querySelector(".hero");

if (hero) {
  window.addEventListener("scroll", () => {
    hero.style.setProperty("--bg-shift", `${window.scrollY * 0.15}px`);
  });
}

/* ======================================================
   SCROLL REVEAL (UNCHANGED)
====================================================== */
const revealElements = document.querySelectorAll(".reveal");

let lastScrollY = window.scrollY;
let scrollDirection = "down";

window.addEventListener("scroll", () => {
  scrollDirection = window.scrollY > lastScrollY ? "down" : "up";
  lastScrollY = window.scrollY;
});

if (revealElements.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("from-up", "from-down");
          entry.target.classList.add(scrollDirection === "down" ? "from-down" : "from-up");

          requestAnimationFrame(() => {
            entry.target.classList.add("active");
          });
        } else {
          entry.target.classList.remove("active");
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );

  revealElements.forEach(el => observer.observe(el));
}

/* ======================================================
   SEARCHABLE COUNTRY SELECTOR (UNCHANGED)
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

  searchInput && searchInput.addEventListener("input", (e) => {
    filterCountries(e.target.value.toLowerCase());
  });

  function filterCountries(query) {
    countryItems.forEach(item => {
      item.style.display = item.textContent.toLowerCase().includes(query)
        ? "block"
        : "none";
    });
  }

  document.addEventListener("click", (e) => {
    if (!selector.contains(e.target)) dropdown.classList.remove("active");
  });
}

/* ======================================================
   PHONE INPUT – NUMBERS ONLY (UNCHANGED)
====================================================== */
const phoneInput = document.querySelector(".phone-input");

phoneInput && phoneInput.addEventListener("input", () => {
  phoneInput.value = phoneInput.value.replace(/\D/g, "");
});

/* ======================================================
   SUCCESS / ERROR DIALOG HELPERS
====================================================== */
// [ADDED]
const successDialog = document.getElementById("successDialog");
const errorDialog = document.getElementById("errorDialog");

function showSuccess() {
  successDialog.classList.add("active");
  launchConfetti();

  const autoClose = setTimeout(() => {
    successDialog.classList.remove("active");
  }, 4500);

  document.getElementById("closeSuccessDialog").onclick = () => {
    clearTimeout(autoClose);
    successDialog.classList.remove("active");
  };
}

function showError() {
  errorDialog.classList.add("active");
  document.getElementById("closeErrorDialog").onclick = () => {
    errorDialog.classList.remove("active");
  };
}

/* ======================================================
   WHATSAPP FORM SUBMIT (SAFE GUARDED)
====================================================== */
const whatsappForm = document.querySelector(".whatsapp-form");

if (whatsappForm) {
  whatsappForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // [SAFE GUARD]
    const nameInput = whatsappForm.querySelector(".input-field");
    const name = nameInput ? nameInput.value.trim() : "";
    const phone = phoneInput ? phoneInput.value.trim() : "";
    const countryCode = selectedCountry?.dataset.code || "+965";

    if (!name || !phone) return;

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxamsuAn-GftmJxzgYXwVhrId6AG4gqcrVM-91Yc8bw6piR3dhMPXGiuZHGEI5zAXRA/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, phone: countryCode + phone })
        }
      );

      const result = await response.json();

      if (result.success) {
        showSuccess();
        toggleModal(whatsappModal, false);
        whatsappForm.reset();
      } else {
        showError();
        console.error("WhatsApp Lead Error:", result.message || result.error);
      }
    } catch (err) {
      showError();
      console.error("WhatsApp Network Error:", err);
    }
  });
}

/* ======================================================
   EMAIL WAITLIST SUBMIT (PAGE + MODAL)
====================================================== */
async function submitEmail(email) {
  const response = await fetch(
    "https://script.google.com/macros/s/AKfycbxamsuAn-GftmJxzgYXwVhrId6AG4gqcrVM-91Yc8bw6piR3dhMPXGiuZHGEI5zAXRA/exec",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    }
  );

  return await response.json();
}

document.querySelectorAll(".email-form, .email-form-modal").forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const input = form.querySelector("input[type='email']");
    const email = input.value.trim();
    if (!email) return;

    try {
      const result = await submitEmail(email);

      if (result.success) {
        showSuccess();
        toggleModal(waitlistModal, false);
        input.value = "";
      } else {
        showError();
        console.error("Email Lead Error:", result.message || result.error);
      }
    } catch (err) {
      showError();
      console.error("Email Network Error:", err);
    }
  });
});


/* ======================================================
   CONFETTI (UNCHANGED)
====================================================== */
function launchConfetti() {
  const container = document.getElementById("confettiContainer");
  if (!container) return;

  for (let i = 0; i < 25; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.animationDelay = Math.random() * 0.3 + "s";
    container.appendChild(confetti);

    setTimeout(() => confetti.remove(), 2000);
  }
}

/* ======================================================
   LANGUAGE TOGGLE – FULL SITE (100% COVERAGE, STATELESS)
====================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------- TRANSLATIONS ---------------- */
  const translations = {
    en: {
      heroEyebrow: "FREEZE-DRIED FRUIT · KUWAIT",
      heroTitle: "Pure, crispy fruit —<br>crafted for performance<br><span class='gold-underline'>and everyday living.</span>",
      heroDesc: "No sugar. No preservatives. Just real freeze-dried fruit that fits your gym, office, and family lifestyle.",
      heroPoints: ["100% Real Fruit", "No Added Sugar", "No Preservatives"],
      cta: "Get 10% Early Access",

      waitlistTitle: "Join the Waiting List",
      waitlistDesc: "Be the first to know when VEYRA launches.",
      emailPlaceholder: "Enter your email",

      snackTitle: "Real fruit. Zero nonsense.<br>Built for real life.",
      snackDesc: "Freeze-dried fruit snacks for gym days, workdays, and everything in between.",
      snackNote: "Real fruit. No sugar. No compromises.",

      problemTitle: "The Snack Problem No One Talks About",
      problems: [
        "Snacks marketed as healthy,<br>loaded with sugar.",
        "Energy that spikes…<br>then crashes.",
        "Messy, inconvenient food<br>you stop carrying."
      ],
      problemFooter: "VEYRA exists because snacking shouldn’t punish your body.",

      useCases: [
        { title: "For the Gym", desc: "Fast fuel. No bloating. No crash." },
        { title: "At Your Desk", desc: "Clean energy without killing focus." },
        { title: "On the Go", desc: "A snack you don’t have to justify." }
      ],

      transformLabels: ["Fresh fruit", "Freeze-dried cubes", "VEYRA packs"],
      transformText: "Same fruit. <span>Smarter form.</span>",

      earlyTitle: "Early members get rewarded.",
      earlyBenefits: [
        "✔ First batch access",
        "✔ Priority stock before sell-out",
        "✔ 10% Early Access to Premium Code"
      ],
      preferEmail: "Prefer email updates?",
      trustText: "No spam. One launch email.",

      whatsappTitle: "Join the WhatsApp Group",
      whatsappDesc: "Get early access updates and launch alerts.",
      namePlaceholder: "Your name",
      phonePlaceholder: "Phone number",
      formNote: "We’ll only message you for launch updates.",

      footerTop: ["Launching soon in Kuwait", "Fulfilled locally"],
      footerLinks: ["Privacy Policy", "Terms of Service"]
    },

    ar: {
      heroEyebrow: "فاكهة مجففة بالتجميد · الكويت",
      heroTitle: "فاكهة نقية ومقرمشة —<br>مصممة للأداء<br><span class='gold-underline'>والحياة اليومية.</span>",
      heroDesc: "بدون سكر. بدون مواد حافظة. فقط فاكهة حقيقية مجففة بالتجميد تناسب الجيم، المكتب، والحياة العائلية.",
      heroPoints: ["فاكهة حقيقية 100%", "بدون سكر مضاف", "بدون مواد حافظة"],
      cta: "احصل على خصم 10٪ مبكرًا",

      waitlistTitle: "انضم إلى قائمة الانتظار",
      waitlistDesc: "كن أول من يعرف عند إطلاق VEYRA.",
      emailPlaceholder: "أدخل بريدك الإلكتروني",

      snackTitle: "فاكهة حقيقية. بدون إضافات.<br>مصممة للحياة الواقعية.",
      snackDesc: "وجبات خفيفة من الفاكهة المجففة بالتجميد لأيام الجيم والعمل وكل ما بينهما.",
      snackNote: "فاكهة حقيقية. بدون سكر. بدون تنازلات.",

      problemTitle: "مشكلة الوجبات الخفيفة التي لا يتحدث عنها أحد",
      problems: [
        "وجبات تُسوّق على أنها صحية<br>ومليئة بالسكر.",
        "طاقة ترتفع بسرعة…<br>ثم تنخفض فجأة.",
        "أطعمة غير عملية<br>تتوقف عن حملها."
      ],
      problemFooter: "VEYRA وُجدت لأن الوجبات الخفيفة لا يجب أن تضر بجسمك.",

      useCases: [
        { title: "للجيم", desc: "طاقة سريعة. بدون انتفاخ. بدون هبوط." },
        { title: "أثناء العمل", desc: "طاقة نظيفة بدون تشتيت التركيز." },
        { title: "أثناء التنقل", desc: "وجبة خفيفة بلا تبرير." }
      ],

      transformLabels: ["فاكهة طازجة", "مكعبات مجففة بالتجميد", "عبوات VEYRA"],
      transformText: "نفس الفاكهة. <span>بشكل أذكى.</span>",

      earlyTitle: "الأعضاء الأوائل يحصلون على مزايا.",
      earlyBenefits: [
        "✔ الوصول إلى أول دفعة",
        "✔ أولوية قبل نفاد الكمية",
        "✔ خصم وصول مبكر 10٪ إلى كود مميز٪"
      ],
      preferEmail: "تفضل التحديثات عبر البريد الإلكتروني؟",
      trustText: "لا رسائل مزعجة. رسالة واحدة عند الإطلاق.",

      whatsappTitle: "انضم إلى مجموعة واتساب",
      whatsappDesc: "احصل على تحديثات الوصول المبكر وتنبيهات الإطلاق.",
      namePlaceholder: "الاسم",
      phonePlaceholder: "رقم الهاتف",
      formNote: "سنراسلك فقط بتحديثات الإطلاق.",

      footerTop: ["الإطلاق قريبًا في الكويت", "التجهيز محليًا"],
      footerLinks: ["سياسة الخصوصية", "شروط الاستخدام"]
    }
  };

  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);
  const langToggle = $("#langToggle");

  let currentLang = "en";

  function setLanguage(lang) {
    const t = translations[lang];

    $(".hero-eyebrow").textContent = t.heroEyebrow;
    $(".hero-title").innerHTML = t.heroTitle;
    $(".hero-content p").textContent = t.heroDesc;

    $$(".hero-points li").forEach((el, i) => el.textContent = t.heroPoints[i]);
    document.querySelectorAll(".cta-text").forEach(el => {
      el.textContent = t.cta;
    });
    $(".snack-text h2").innerHTML = t.snackTitle;
    $(".snack-text p").textContent = t.snackDesc;
    $(".snack-note").textContent = t.snackNote;

    $(".snack-problems h3").textContent = t.problemTitle;
    $$(".problem-item p").forEach((el, i) => el.innerHTML = t.problems[i]);
    $(".snack-footer").textContent = t.problemFooter;

    $$(".use-card").forEach((card, i) => {
      card.querySelector("h4").textContent = t.useCases[i].title;
      card.querySelector("p").textContent = t.useCases[i].desc;
    });

    $$(".fruit-side span").forEach((el, i) => el.textContent = t.transformLabels[i]);
    $(".transform-text").innerHTML = t.transformText;

    $(".early-container h3").textContent = t.earlyTitle;
    $$(".early-benefits li").forEach((el, i) => el.textContent = t.earlyBenefits[i]);
    $(".email-text").textContent = t.preferEmail;
    $(".trust-text").textContent = t.trustText;
    $("#emailWaitlistInput").placeholder = t.emailPlaceholder;

    $("#whatsappModal h2").textContent = t.whatsappTitle;
    $("#whatsappModal p").textContent = t.whatsappDesc;
    $(".whatsapp-form .input-field").placeholder = t.namePlaceholder;
    $(".phone-input").placeholder = t.phonePlaceholder;
    $(".form-note").textContent = t.formNote;
    // WhatsApp modal submit button
    const whatsappSubmitBtn = document.querySelector(".whatsapp-form .submit-btn");
    if (whatsappSubmitBtn) {
      whatsappSubmitBtn.textContent = t.cta;
    }


    document.querySelector(".email-submit-btn") && (document.querySelector(".email-submit-btn").textContent = t.cta);

    const footerSpans = $$(".footer-top span");
    footerSpans[0].textContent = t.footerTop[0];
    footerSpans[2].textContent = t.footerTop[1];
    $$(".footer-bottom a").forEach((el, i) => el.textContent = t.footerLinks[i]);

    document.body.classList.toggle("rtl", lang === "ar");
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    langToggle.textContent = lang === "ar" ? "English" : "العربية";

    currentLang = lang;
  }

  /* ======================================
   AUTO LANGUAGE DETECTION (NO STORAGE)
====================================== */

function detectInitialLanguage() {
  const browserLangs = navigator.languages || [navigator.language || "en"];
  const browserLang = browserLangs[0].toLowerCase();

  // 1. Browser prefers Arabic
  if (browserLang.startsWith("ar")) {
    return "ar";
  }

  // 2. GCC / Kuwait heuristic (timezone-based, no IP, no storage)
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";

  const gccTimezones = [
    "Asia/Kuwait",
    "Asia/Riyadh",
    "Asia/Dubai",
    "Asia/Qatar",
    "Asia/Bahrain",
    "Asia/Muscat"
  ];

  if (gccTimezones.includes(timeZone)) {
    return "ar";
  }

  // 3. Default fallback
  return "en";
}

const initialLang = detectInitialLanguage();
setLanguage(initialLang);

  const langRoot = document.getElementById("langRoot");

  langToggle.addEventListener("click", () => {
    if (!langRoot) return;

    // fade out
    langRoot.classList.remove("active");

  setTimeout(() => {
    setLanguage(currentLang === "en" ? "ar" : "en");

    requestAnimationFrame(() => {
      langRoot.classList.add("active");
    });
  }, 380);
  });
});
