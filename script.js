/* ======================================================
   SHARED WAITLIST SCROLL ELEMENTS (DECLARE ONCE)
====================================================== */
const emailWaitlistSection = document.getElementById("email-waitlist");
const emailInput = document.getElementById("emailWaitlistInput");

const pageEmailInput = document.getElementById("emailWaitlistInput");
const modalEmailInput = document.getElementById("modalEmailInput");


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
const whatsappForm = document.querySelector(".whatsapp-form");
const openWhatsappBtn = document.getElementById("openWhatsappForm");
const whatsappModal = document.getElementById("whatsappModal");
const waitlistModal = document.getElementById("waitlistModal"); // ✅ ADD THIS
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

    validateWhatsappPhone(); // ✅ re-check phone format
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
   HELPERS: ERROR UI
====================================================== */
function showFieldError(inputEl, message) {
  if (!inputEl) return;

  inputEl.classList.add("input-error");

  // ✅ Choose correct container where error should appear
  const container =
    inputEl.classList.contains("phone-input")
      ? inputEl.closest(".phone-group") // phone error below phone block
      : inputEl.closest(".email-form") || inputEl.closest(".email-form-modal") // email error below form
      || inputEl.parentElement;

  if (!container) return;

  let err = container.querySelector(".field-error");
  if (!err) {
    err = document.createElement("div");
    err.className = "field-error";
    container.appendChild(err);
  }

  err.textContent = message;
}

function clearFieldError(inputEl) {
  if (!inputEl) return;

  inputEl.classList.remove("input-error");

  const container =
    inputEl.classList.contains("phone-input")
      ? inputEl.closest(".phone-group")
      : inputEl.closest(".email-form") || inputEl.closest(".email-form-modal")
      || inputEl.parentElement;

  if (!container) return;

  const err = container.querySelector(".field-error");
  if (err) err.remove();
}


/* ======================================================
   VALIDATION RULES
====================================================== */

// ✅ Email Validation
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

// ✅ Phone Rules by country code
function getPhoneRule(countryCode) {
  if (countryCode === "+965") return { min: 8, max: 8, msgKey: "kwPhone" };
  if (countryCode === "+91") return { min: 10, max: 10, msgKey: "indiaPhone" };
  if (countryCode === "+971") return { min: 9, max: 9, msgKey: "uaePhone" };

  return { min: 7, max: 15, msgKey: "phoneGeneric" };
}


/* ======================================================
   PHONE INPUT – NUMBERS ONLY (REAL-TIME)
====================================================== */
const phoneInput = document.querySelector(".phone-input");
if (phoneInput) {
  phoneInput.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, "");
  });
}

/* ======================================================
   REAL-TIME VALIDATION FUNCTIONS
====================================================== */

// ✅ WhatsApp Name
function validateWhatsappName() {
  if (!whatsappForm) return true;

  const t = errorTexts[currentLang];
  const nameInput = whatsappForm.querySelector(".input-field");
  if (!nameInput) return true;

  const name = nameInput.value.trim();

  if (!name) {
    showFieldError(nameInput, t.nameRequired);
    return false;
  }

  if (name.length < 2) {
    showFieldError(nameInput, t.nameShort);
    return false;
  }

  clearFieldError(nameInput);
  return true;
}


// ✅ WhatsApp Phone
function validateWhatsappPhone() {
  if (!phoneInput) return true;

  const t = errorTexts[currentLang];
  const phone = phoneInput.value.trim();
  const countryCode = selectedCountry?.dataset.code || "+965";
  const rule = getPhoneRule(countryCode);

  if (!phone) {
    showFieldError(phoneInput, t.phoneRequired);
    return false;
  }

  if (!/^\d+$/.test(phone)) {
    showFieldError(phoneInput, t.phoneDigitsOnly);
    return false;
  }

  if (phone.length < rule.min || phone.length > rule.max) {
    showFieldError(phoneInput, t[rule.msgKey]);
    return false;
  }

  clearFieldError(phoneInput);
  return true;
}


// ✅ Email Validation (works for both page + modal)
function validateEmailInput(inputEl) {
  if (!inputEl) return true;

  const t = errorTexts[currentLang];
  const email = inputEl.value.trim();

  if (!email) {
    showFieldError(inputEl, t.emailRequired);
    return false;
  }

  if (!isValidEmail(email)) {
    showFieldError(inputEl, t.emailInvalid);
    return false;
  }

  clearFieldError(inputEl);
  return true;
}


/* ======================================================
   REAL-TIME EMAIL VALIDATION (PAGE + MODAL)
====================================================== */
function attachEmailRealtimeValidation(inputEl) {
  if (!inputEl) return;

  inputEl.addEventListener("input", () => {
    const t = errorTexts[currentLang];
    const v = inputEl.value.trim();

    if (!v) {
      clearFieldError(inputEl);
      return;
    }

    if (!isValidEmail(v)) {
      showFieldError(inputEl, t.emailInvalid);
    } else {
      clearFieldError(inputEl);
    }
  });

  inputEl.addEventListener("blur", () => {
    const t = errorTexts[currentLang];
    const v = inputEl.value.trim();

    if (v && !isValidEmail(v)) {
      showFieldError(inputEl, t.emailInvalid);
    }
  });
}

attachEmailRealtimeValidation(pageEmailInput);
attachEmailRealtimeValidation(modalEmailInput);

/* ======================================================
   REAL-TIME WHATSAPP VALIDATION
====================================================== */
if (whatsappForm) {
  const nameInput = whatsappForm.querySelector(".input-field"); // name field
  if (nameInput) {
    nameInput.addEventListener("input", validateWhatsappName);
    nameInput.addEventListener("blur", validateWhatsappName);
  }
}

if (phoneInput) {
  phoneInput.addEventListener("input", validateWhatsappPhone);
  phoneInput.addEventListener("blur", validateWhatsappPhone);
}

/* ======================================================
   API URL (YOUR EXISTING)
====================================================== */
const API_URL =
  "https://script.google.com/macros/s/AKfycbxamsuAn-GftmJxzgYXwVhrId6AG4gqcrVM-91Yc8bw6piR3dhMPXGiuZHGEI5zAXRA/exec";

/* ======================================================
   WHATSAPP FORM SUBMIT (OLD WORKING + VALIDATION ✅)
====================================================== */
if (whatsappForm) {
  whatsappForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = whatsappForm.querySelector(".input-field"); // name input
    const name = nameInput ? nameInput.value.trim() : "";
    const phone = phoneInput ? phoneInput.value.trim() : "";
    const countryCode = selectedCountry?.dataset.code || "+965";

    // ✅ Validate before sending
    const okName = validateWhatsappName();
    const okPhone = validateWhatsappPhone();
    if (!okName || !okPhone) return;

    try {
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
        body: JSON.stringify({ name, phone: countryCode + phone }),
      });

      showSuccess();
      toggleModal(whatsappModal, false);
      whatsappForm.reset();
    } catch (err) {
      showError();
      console.error("WhatsApp Error:", err);
    }
  });
}

/* ======================================================
   EMAIL WAITLIST SUBMIT (PAGE + MODAL) + VALIDATION ✅
====================================================== */
function submitEmail(email) {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    mode: "no-cors",
    body: JSON.stringify({ email }),
  });
}

document.querySelectorAll(".email-form, .email-form-modal").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const input = form.querySelector("input[type='email']");
    if (!input) return;

    // ✅ Validate before sending
    const okEmail = validateEmailInput(input);
    if (!okEmail) return;

    try {
      submitEmail(input.value.trim());

      showSuccess();
      toggleModal(waitlistModal, false);
      input.value = "";
    } catch (err) {
      showError();
      console.error("Email Error:", err);
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
let currentLang = "en";


  const errorTexts = {
  en: {
    nameRequired: "Please enter your name.",
    nameShort: "Name must be at least 2 characters.",
    phoneRequired: "Please enter your phone number.",
    phoneDigitsOnly: "Phone must contain only digits.",
    kwPhone: "Kuwait numbers must be exactly 8 digits.",
    indiaPhone: "India numbers must be exactly 10 digits.",
    uaePhone: "UAE numbers must be exactly 9 digits.",
    phoneGeneric: "Phone number must be 7 to 15 digits.",
    emailRequired: "Please enter your email.",
    emailInvalid: "Please enter a valid email address.",
    cta: "Get 10% Discount on Early Access",
    ctaSubtext: "Limited first batch. Early access closes soon."

  },

  ar: {
    nameRequired: "يرجى إدخال الاسم.",
    nameShort: "يجب أن يحتوي الاسم على حرفين على الأقل.",
    phoneRequired: "يرجى إدخال رقم الهاتف.",
    phoneDigitsOnly: "رقم الهاتف يجب أن يحتوي على أرقام فقط.",
    kwPhone: "رقم الكويت يجب أن يكون 8 أرقام.",
    indiaPhone: "رقم الهند يجب أن يكون 10 أرقام.",
    uaePhone: "رقم الإمارات يجب أن يكون 9 أرقام.",
    phoneGeneric: "رقم الهاتف يجب أن يكون بين 7 و 15 رقمًا.",
    emailRequired: "يرجى إدخال البريد الإلكتروني.",
    emailInvalid: "يرجى إدخال بريد إلكتروني صحيح.",
    cta: "احصل على خصم 10٪ مع الوصول المبكر",
    ctaSubtext: "الكمية الأولى محدودة. ينتهي الوصول المبكر قريبًا."

  }
};


document.addEventListener("DOMContentLoaded", () => {

  /* ---------------- TRANSLATIONS ---------------- */
  const translations = {
    en: {
      heroEyebrow: "FREEZE-DRIED FRUIT · KUWAIT",
      heroTitle: "Pure, crispy fruit —<br>crafted for performance<br><span class='gold-underline'>and everyday living.</span>",
      heroDesc: "No sugar. No preservatives. Just real freeze-dried fruit that fits your gym, office, and family lifestyle.",
      heroPoints: ["100% Real Fruit", "No Added Sugar", "No Preservatives"],
      cta: "Get 10% Discount on Early Access",
      ctaSubtext: "Limited first batch. Early access closes soon.",

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
      footerLinks: ["Privacy Policy", "Terms of Service"],

      timerRunning: "Early access closes in",
      timerClosed: "Early access is now closed",

    },

    ar: {
      heroEyebrow: "فاكهة مجففة بالتجميد · الكويت",
      heroTitle: "فاكهة نقية ومقرمشة —<br>مصممة للأداء<br><span class='gold-underline'>والحياة اليومية.</span>",
      heroDesc: "بدون سكر. بدون مواد حافظة. فقط فاكهة حقيقية مجففة بالتجميد تناسب الجيم، المكتب، والحياة العائلية.",
      heroPoints: ["فاكهة حقيقية 100%", "بدون سكر مضاف", "بدون مواد حافظة"],
      emailInvalid: "يرجى إدخال بريد إلكتروني صحيح.",
      cta: "احصل على خصم 10٪ مع الوصول المبكر",
      ctaSubtext: "الكمية الأولى محدودة. ينتهي الوصول المبكر قريبًا.",
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
      footerLinks: ["سياسة الخصوصية", "شروط الاستخدام"],

      timerRunning: "ينتهي الوصول المبكر خلال",
      timerClosed: "تم إغلاق الوصول المبكر",

    
    }
  };


  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);
  const langToggle = $("#langToggle");


  function setLanguage(lang) {
  const t = translations[lang];

  // HERO
  document.querySelector(".hero-eyebrow").textContent = t.heroEyebrow;
  document.querySelector(".hero-title").innerHTML = t.heroTitle;
  document.querySelector(".hero-content p").textContent = t.heroDesc;

  document.querySelectorAll(".hero-points li")
    .forEach((el, i) => el.textContent = t.heroPoints[i]);

    // HERO CTA
    const heroCta = document.getElementById("waitlistBtn");
    if (heroCta) heroCta.textContent = t.cta;

    // WHATSAPP CTA (GREEN BUTTON)
    document.querySelectorAll(".cta-text")
      .forEach(el => el.textContent = t.cta);

    // CTA SUBTEXT
    const ctaSubtext = document.querySelector(".cta-subtext");
    if (ctaSubtext) ctaSubtext.textContent = t.ctaSubtext;


  // SNACK SECTION
  document.querySelector(".snack-text h2").innerHTML = t.snackTitle;
  document.querySelector(".snack-text p").textContent = t.snackDesc;
  document.querySelector(".snack-note").textContent = t.snackNote;

  document.querySelector(".snack-problems h3").textContent = t.problemTitle;
  document.querySelectorAll(".problem-item p")
    .forEach((el, i) => el.innerHTML = t.problems[i]);

  document.querySelector(".snack-footer").textContent = t.problemFooter;

  // USE CASES
  document.querySelectorAll(".use-card").forEach((card, i) => {
    card.querySelector("h4").textContent = t.useCases[i].title;
    card.querySelector("p").textContent = t.useCases[i].desc;
  });

  // TRANSFORMATION
  document.querySelector(".transform-text").innerHTML = t.transformText;

  // EARLY ACCESS
  document.querySelector(".early-container h3").textContent = t.earlyTitle;
  document.querySelectorAll(".early-benefits li")
    .forEach((el, i) => el.textContent = t.earlyBenefits[i]);

  document.querySelector(".email-text").textContent = t.preferEmail;
  document.querySelector(".trust-text").textContent = t.trustText;

  const emailInput = document.getElementById("emailWaitlistInput");
  if (emailInput) emailInput.placeholder = t.emailPlaceholder;

  // WHATSAPP MODAL
  document.querySelector("#whatsappModal h2").textContent = t.whatsappTitle;
  document.querySelector("#whatsappModal p").textContent = t.whatsappDesc;
  document.querySelector(".whatsapp-form .input-field").placeholder = t.namePlaceholder;
  document.querySelector(".phone-input").placeholder = t.phonePlaceholder;
  document.querySelector(".form-note").textContent = t.formNote;

  const whatsappSubmitBtn = document.querySelector(".whatsapp-form .submit-btn");
  if (whatsappSubmitBtn) whatsappSubmitBtn.textContent = t.cta;

  // EMAIL SUBMIT BUTTON
  document.querySelectorAll(".email-submit-btn")
    .forEach(btn => btn.textContent = t.cta);

  // FOOTER
  const footerSpans = document.querySelectorAll(".footer-top span");
  footerSpans[0].textContent = t.footerTop[0];
  footerSpans[2].textContent = t.footerTop[1];

  document.querySelectorAll(".footer-bottom a")
    .forEach((el, i) => el.textContent = t.footerLinks[i]);

  if (timerLabel && timerDigits) {
  timerLabel.textContent = t.timerRunning;
  }


  // RTL / LANGUAGE
  document.body.classList.toggle("rtl", lang === "ar");
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = lang;

  document.getElementById("langToggle").textContent =
    lang === "ar" ? "English" : "العربية";

  currentLang = lang;
  }


/* ======================================================
   EARLY ACCESS COUNTDOWN (48 HOURS, PERSISTENT)
====================================================== */

const TIMER_DURATION = 48 * 60 * 60 * 1000; // 48 hours
const TIMER_KEY = "veyraEarlyAccessEnd";

const timerEl = document.getElementById("launchTimer");
const timerLabel = document.getElementById("timerLabel");
const timerDigits = document.getElementById("timerDigits");

function initEarlyAccessTimer() {
  if (!timerEl || !timerDigits || !timerLabel) return;

  let endTime = localStorage.getItem(TIMER_KEY);

  if (!endTime) {
    endTime = Date.now() + TIMER_DURATION;
    localStorage.setItem(TIMER_KEY, endTime);
  } else {
    endTime = parseInt(endTime, 10);
  }

  function updateTimer() {
    const now = Date.now();
    const diff = endTime - now;

    if (diff <= 0) {
      handleTimerEnd();
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    timerDigits.textContent =
      `${String(hours).padStart(2, "0")} : ` +
      `${String(minutes).padStart(2, "0")} : ` +
      `${String(seconds).padStart(2, "0")}`;
  }

  function handleTimerEnd() {
    timerEl.classList.add("closed");

    timerDigits.textContent =
      currentLang === "ar"
        ? "تم إغلاق الوصول المبكر"
        : "Early access is now closed";

    timerLabel.textContent = "";

    // Disable Hero CTA
    const heroBtn = document.getElementById("waitlistBtn");
    if (heroBtn) heroBtn.disabled = true;

    // Disable WhatsApp CTA
    document.querySelectorAll("#openWhatsappForm").forEach(btn => {
      btn.disabled = true;
    });

    clearInterval(timerInterval);
  }

  updateTimer();
  const timerInterval = setInterval(updateTimer, 1000);
}

initEarlyAccessTimer();


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

