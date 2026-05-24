/* ======================================================
   CONSTANTS
====================================================== */
const API_URL =
  "https://script.google.com/macros/s/AKfycbxamsuAn-GftmJxzgYXwVhrId6AG4gqcrVM-91Yc8bw6piR3dhMPXGiuZHGEI5zAXRA/exec";

const TIMER_DURATION = 48 * 60 * 60 * 1000;
const RESET_DELAY    = 15 * 60 * 1000;
const TIMER_KEY      = "veyraLoopTimer";
const POPUP_DELAY    = 5000;

/* ======================================================
   VALIDATION — ERROR TEXTS
====================================================== */
const errorTexts = {
  en: {
    nameRequired:   "Please enter your name.",
    nameShort:      "Name must be at least 2 characters.",
    phoneRequired:  "Please enter your phone number.",
    phoneDigitsOnly:"Phone must contain only digits.",
    kwPhone:        "Kuwait numbers must be exactly 8 digits.",
    indiaPhone:     "India numbers must be exactly 10 digits.",
    uaePhone:       "UAE numbers must be exactly 9 digits.",
    phoneGeneric:   "Phone number must be 7 to 15 digits.",
    emailRequired:  "Please enter your email.",
    emailInvalid:   "Please enter a valid email address.",
  },
  ar: {
    nameRequired:   "يرجى إدخال الاسم.",
    nameShort:      "يجب أن يحتوي الاسم على حرفين على الأقل.",
    phoneRequired:  "يرجى إدخال رقم الهاتف.",
    phoneDigitsOnly:"رقم الهاتف يجب أن يحتوي على أرقام فقط.",
    kwPhone:        "رقم الكويت يجب أن يكون 8 أرقام.",
    indiaPhone:     "رقم الهند يجب أن يكون 10 أرقام.",
    uaePhone:       "رقم الإمارات يجب أن يكون 9 أرقام.",
    phoneGeneric:   "رقم الهاتف يجب أن يكون بين 7 و 15 رقمًا.",
    emailRequired:  "يرجى إدخال البريد الإلكتروني.",
    emailInvalid:   "يرجى إدخال بريد إلكتروني صحيح.",
  },
};

let currentLang = "en";

/* ======================================================
   UTILITY — MODAL TOGGLE
====================================================== */
const toggleModal = (modal, open) => {
  if (!modal) return;
  modal.style.display = open ? "flex" : "none";
  document.body.style.overflow = open ? "hidden" : "";
};

/* ======================================================
   UTILITY — FIELD ERROR UI
====================================================== */
const getErrorContainer = (inputEl) =>
  inputEl.classList.contains("phone-input")
    ? inputEl.closest(".phone-group")
    : inputEl.closest(".email-form") ||
      inputEl.closest(".email-form-modal") ||
      inputEl.parentElement;

const showFieldError = (inputEl, message) => {
  if (!inputEl) return;
  inputEl.classList.add("input-error");

  const container = getErrorContainer(inputEl);
  if (!container) return;

  let err = container.querySelector(".field-error");
  if (!err) {
    err = document.createElement("div");
    err.className = "field-error";
    container.appendChild(err);
  }
  err.textContent = message;
};

const clearFieldError = (inputEl) => {
  if (!inputEl) return;
  inputEl.classList.remove("input-error");

  const container = getErrorContainer(inputEl);
  if (!container) return;

  container.querySelector(".field-error")?.remove();
};

/* ======================================================
   VALIDATION — RULES
====================================================== */
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

const getPhoneRule = (countryCode) => {
  const rules = {
    "+965": { min: 8,  max: 8,  msgKey: "kwPhone" },
    "+91":  { min: 10, max: 10, msgKey: "indiaPhone" },
    "+971": { min: 9,  max: 9,  msgKey: "uaePhone" },
  };
  return rules[countryCode] ?? { min: 7, max: 15, msgKey: "phoneGeneric" };
};

const validateEmailInput = (inputEl) => {
  if (!inputEl) return true;
  const t = errorTexts[currentLang];
  const email = inputEl.value.trim();

  if (!email) { showFieldError(inputEl, t.emailRequired); return false; }
  if (!isValidEmail(email)) { showFieldError(inputEl, t.emailInvalid); return false; }

  clearFieldError(inputEl);
  return true;
};

const validatePhoneForInput = (inputEl, countryCode) => {
  if (!inputEl) return true;
  const t = errorTexts[currentLang];
  const phone = inputEl.value.trim();
  const rule = getPhoneRule(countryCode);

  if (!phone) { showFieldError(inputEl, t.phoneRequired); return false; }
  if (!/^\d+$/.test(phone)) { showFieldError(inputEl, t.phoneDigitsOnly); return false; }
  if (phone.length < rule.min || phone.length > rule.max) {
    showFieldError(inputEl, t[rule.msgKey]);
    return false;
  }

  clearFieldError(inputEl);
  return true;
};

const validateName = (inputEl) => {
  if (!inputEl) return true;
  const t = errorTexts[currentLang];
  const name = inputEl.value.trim();

  if (!name) { showFieldError(inputEl, t.nameRequired); return false; }
  if (name.length < 2) { showFieldError(inputEl, t.nameShort); return false; }

  clearFieldError(inputEl);
  return true;
};

/* ======================================================
   UTILITY — EMAIL REAL-TIME VALIDATION
====================================================== */
const attachEmailRealtimeValidation = (inputEl) => {
  if (!inputEl) return;

  inputEl.addEventListener("input", () => {
    const v = inputEl.value.trim();
    if (!v) { clearFieldError(inputEl); return; }
    if (!isValidEmail(v)) {
      showFieldError(inputEl, errorTexts[currentLang].emailInvalid);
    } else {
      clearFieldError(inputEl);
    }
  });

  inputEl.addEventListener("blur", () => {
    const v = inputEl.value.trim();
    if (v && !isValidEmail(v)) {
      showFieldError(inputEl, errorTexts[currentLang].emailInvalid);
    }
  });
};

/* ======================================================
   UTILITY — COUNTRY SELECTOR FACTORY
   Handles both the WhatsApp modal and the Waitlist modal
====================================================== */
const initCountrySelector = ({ selectorId, selectedId, dropdownId, onSelect }) => {
  const selector = document.getElementById(selectorId);
  const selected = document.getElementById(selectedId);
  const dropdown = document.getElementById(dropdownId);
  if (!selector || !selected || !dropdown) return;

  const searchInput   = dropdown.querySelector(".country-search");
  const countryItems  = dropdown.querySelectorAll(".country-list li");

  const filterCountries = (query) => {
    countryItems.forEach((item) => {
      item.style.display = item.textContent.toLowerCase().includes(query)
        ? "block"
        : "none";
    });
  };

  selected.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("active");
    if (searchInput) {
      searchInput.value = "";
      filterCountries("");
    }
  });

  countryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const label = item.getAttribute("data-label") || item.textContent.trim();
      selected.textContent = label;
      selected.dataset.code = item.dataset.code;
      dropdown.classList.remove("active");
      onSelect?.(item.dataset.code);
    });
  });

  searchInput?.addEventListener("input", (e) => {
    filterCountries(e.target.value.toLowerCase());
  });

  document.addEventListener("click", (e) => {
    if (!selector.contains(e.target)) dropdown.classList.remove("active");
  });
};

/* ======================================================
   UTILITY — CONFETTI
====================================================== */
const launchConfetti = () => {
  const container = document.getElementById("confettiContainer");
  if (!container) return;

  for (let i = 0; i < 25; i++) {
    const piece = document.createElement("div");
    piece.classList.add("confetti");
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.animationDelay = `${Math.random() * 0.3}s`;
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 2000);
  }
};

/* ======================================================
   UTILITY — SUCCESS / ERROR DIALOGS
====================================================== */
const successDialog = document.getElementById("successDialog");
const errorDialog   = document.getElementById("errorDialog");

const showSuccess = () => {
  successDialog.classList.add("active");
  launchConfetti();

  const autoClose = setTimeout(() => successDialog.classList.remove("active"), 4500);
  document.getElementById("closeSuccessDialog").onclick = () => {
    clearTimeout(autoClose);
    successDialog.classList.remove("active");
  };
};

const showError = () => {
  errorDialog.classList.add("active");
  document.getElementById("closeErrorDialog").onclick = () => {
    errorDialog.classList.remove("active");
  };
};

/* ======================================================
   UTILITY — SUBMIT EMAIL TO API
====================================================== */
const submitEmail = (email) =>
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    mode: "no-cors",
    body: JSON.stringify({ email }),
  });

/* ======================================================
   SCROLL REVEAL
====================================================== */
const revealElements = document.querySelectorAll(".reveal");
let lastScrollY      = window.scrollY;
let scrollDirection  = "down";

window.addEventListener("scroll", () => {
  scrollDirection = window.scrollY > lastScrollY ? "down" : "up";
  lastScrollY = window.scrollY;
});

if (revealElements.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("from-up", "from-down");
          entry.target.classList.add(
            scrollDirection === "down" ? "from-down" : "from-up"
          );
          requestAnimationFrame(() => entry.target.classList.add("active"));
        } else {
          entry.target.classList.remove("active");
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ======================================================
   HERO PARALLAX
====================================================== */
const heroImageEl = document.querySelector(".hero-image-wrapper img");
let rafId = null;

if (heroImageEl) {
  window.addEventListener("mousemove", (e) => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      const x = (window.innerWidth  / 2 - e.clientX) / 40;
      const y = (window.innerHeight / 2 - e.clientY) / 40;
      heroImageEl.style.transform = `translate(${x}px, ${y}px)`;
      rafId = null;
    });
  });
}

/* ======================================================
   SCROLL BACKGROUND DEPTH
====================================================== */
const heroSection = document.querySelector(".hero");
if (heroSection) {
  window.addEventListener("scroll", () => {
    heroSection.style.setProperty("--bg-shift", `${window.scrollY * 0.15}px`);
  });
}

/* ======================================================
   DOM-READY INITIALIZATION
====================================================== */
document.addEventListener("DOMContentLoaded", () => {

  /* ----------- DOM REFS ----------- */
  const emailWaitlistSection = document.getElementById("email-waitlist");
  const emailWaitlistInput   = document.getElementById("emailWaitlistInput");
  const waitlistModal        = document.getElementById("waitlistModal");
  const whatsappModal        = document.getElementById("whatsappModal");
  const whatsappForm         = document.querySelector(".whatsapp-form");
  const waitlistPhoneForm    = document.querySelector(".waitlist-phone-form");
  const waitlistPhoneInput   = document.getElementById("waitlistPhoneInput");
  const langRoot             = document.getElementById("langRoot");
  const langToggle           = document.getElementById("langToggle");
  const timerEl              = document.getElementById("launchTimer");
  const timerLabel           = document.getElementById("timerLabel");
  const timerDigits          = document.getElementById("timerDigits");

  /* ----------- TRANSLATIONS ----------- */
  const translations = {
    en: {
      heroEyebrow:  "FREEZE-DRIED FRUIT · KUWAIT",
      heroTitle:    `Most "healthy" snacks<br>are sugar in disguise.<br><span class='gold-underline'>This isn't.</span>`,
      heroDesc:     "Freeze-dried fruit made for people who train, work, and care about what goes into their body.",
      heroPoints:   ["100% Real Fruit", "No Added Sugar", "No Preservatives"],
      cta:          "Get 10% Discount on Early Access",
      ctaSubtext:   "Limited first batch. Early access closes soon.",

      waitlistTitle: "Get 10% off your first order",
      waitlistDesc:  "Early access is limited to the first batch.",
      emailPlaceholder: "Enter your email",
      popupBenefits: [
        "10% launch code for first batch",
        "Private WhatsApp early-access list",
        "Limited slots before public release",
      ],

      snackTitle:   "Real fruit. Zero nonsense.<br>Built for real life.",
      snackDesc:    "Freeze-dried fruit snacks for gym days, workdays, and everything in between.",
      snackNote:    "Real fruit. No sugar. No compromises.",

      problemTitle: "The Snack Problem No One Talks About",
      problems: [
        "Snacks marketed as healthy,<br>loaded with sugar.",
        "Energy that spikes…<br>then crashes.",
        "Messy, inconvenient food<br>you stop carrying.",
      ],
      problemFooter: "VEYRA exists because snacking shouldn't punish your body.",

      useCases: [
        { title: "For the Gym",    desc: "Fast fuel. No bloating. No crash." },
        { title: "At Your Desk",   desc: "Clean energy without killing focus." },
        { title: "On the Go",      desc: "A snack you don't have to justify." },
      ],

      transformText: "Same fruit. <span>Smarter form.</span>",

      earlyTitle:    "Early members get rewarded.",
      earlyBenefits: [
        "✔ First batch access",
        "✔ Priority stock before sell-out",
        "✔ 10% Early Access to Premium Code",
      ],
      preferEmail: "Prefer email updates?",
      trustText:   "No spam. One launch email.",

      whatsappTitle: "Join the WhatsApp Group",
      whatsappDesc:  "Get early access updates and launch alerts.",
      namePlaceholder:   "Your name",
      phonePlaceholder:  "Phone number",
      formNote:          "We'll only message you for launch updates.",

      footerTop:   ["Launching soon in Kuwait", "Fulfilled locally"],
      footerLinks: ["Privacy Policy", "Terms of Service"],

      timerRunning: "Early access closes in",
      timerClosed:  "Early access closing soon",
    },

    ar: {
      heroEyebrow:  "فاكهة مجففة بالتجميد · الكويت",
      heroTitle:    `معظم الوجبات الخفيفة "الصحية"<br>تحتوي على سكر مخفي.<br><span class='gold-underline'>هذا ليس كذلك.</span>`,
      heroDesc:     "فاكهة مجففة بالتجميد مصنوعة للأشخاص الذين يتمرنون، يعملون، ويهتمون بما يدخل إلى أجسامهم.",
      heroPoints:   ["فاكهة حقيقية 100%", "بدون سكر مضاف", "بدون مواد حافظة"],
      cta:          "احصل على خصم 10٪ مع الوصول المبكر",
      ctaSubtext:   "الكمية الأولى محدودة. ينتهي الوصول المبكر قريبًا.",

      waitlistTitle: "احصل على خصم 10٪ على أول طلب",
      waitlistDesc:  "الوصول المبكر محدود بالدفعة الأولى.",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      popupBenefits: [
        "كود خصم 10٪ للدفعة الأولى",
        "قائمة واتساب خاصة للوصول المبكر",
        "عدد محدود قبل الإطلاق الرسمي",
      ],

      snackTitle:   "فاكهة حقيقية. بدون إضافات.<br>مصممة للحياة الواقعية.",
      snackDesc:    "وجبات خفيفة من الفاكهة المجففة بالتجميد لأيام الجيم والعمل وكل ما بينهما.",
      snackNote:    "فاكهة حقيقية. بدون سكر. بدون تنازلات.",

      problemTitle: "مشكلة الوجبات الخفيفة التي لا يتحدث عنها أحد",
      problems: [
        "وجبات تُسوّق على أنها صحية<br>ومليئة بالسكر.",
        "طاقة ترتفع بسرعة…<br>ثم تنخفض فجأة.",
        "أطعمة غير عملية<br>تتوقف عن حملها.",
      ],
      problemFooter: "VEYRA وُجدت لأن الوجبات الخفيفة لا يجب أن تضر بجسمك.",

      useCases: [
        { title: "للجيم",         desc: "طاقة سريعة. بدون انتفاخ. بدون هبوط." },
        { title: "أثناء العمل",   desc: "طاقة نظيفة بدون تشتيت التركيز." },
        { title: "أثناء التنقل",  desc: "وجبة خفيفة بلا تبرير." },
      ],

      transformText: "نفس الفاكهة. <span>بشكل أذكى.</span>",

      earlyTitle:    "الأعضاء الأوائل يحصلون على مزايا.",
      earlyBenefits: [
        "✔ الوصول إلى أول دفعة",
        "✔ أولوية قبل نفاد الكمية",
        "✔ خصم وصول مبكر 10٪ إلى كود مميز٪",
      ],
      preferEmail: "تفضل التحديثات عبر البريد الإلكتروني؟",
      trustText:   "لا رسائل مزعجة. رسالة واحدة عند الإطلاق.",

      whatsappTitle: "انضم إلى مجموعة واتساب",
      whatsappDesc:  "احصل على تحديثات الوصول المبكر وتنبيهات الإطلاق.",
      namePlaceholder:  "الاسم",
      phonePlaceholder: "رقم الهاتف",
      formNote:         "سنراسلك فقط بتحديثات الإطلاق.",

      footerTop:   ["الإطلاق قريبًا في الكويت", "التجهيز محليًا"],
      footerLinks: ["سياسة الخصوصية", "شروط الاستخدام"],

      timerRunning: "ينتهي الوصول المبكر خلال",
      timerClosed:  "سينتهي الوصول المبكر قريباً",
    },
  };

  /* ----------- SET LANGUAGE ----------- */
  const setLanguage = (lang) => {
    const t = translations[lang];

    // Hero
    document.querySelector(".hero-eyebrow").textContent       = t.heroEyebrow;
    document.querySelector(".hero-title").innerHTML           = t.heroTitle;
    document.querySelector(".hero-content p").textContent     = t.heroDesc;
    document.querySelectorAll(".hero-points li")
      .forEach((el, i) => (el.textContent = t.heroPoints[i]));

    const heroCta = document.getElementById("waitlistBtn");
    if (heroCta) heroCta.textContent = t.cta;

    document.querySelectorAll(".cta-text")
      .forEach((el) => (el.textContent = t.cta));

    const ctaSubtext = document.querySelector(".cta-subtext");
    if (ctaSubtext) ctaSubtext.textContent = t.ctaSubtext;

    // Snack section
    document.querySelector(".snack-text h2").innerHTML     = t.snackTitle;
    document.querySelector(".snack-text p").textContent    = t.snackDesc;
    document.querySelector(".snack-note").textContent      = t.snackNote;
    document.querySelector(".snack-problems h3").textContent = t.problemTitle;
    document.querySelectorAll(".problem-item p")
      .forEach((el, i) => (el.innerHTML = t.problems[i]));
    document.querySelector(".snack-footer").textContent    = t.problemFooter;

    // Use cases
    document.querySelectorAll(".use-card").forEach((card, i) => {
      card.querySelector("h4").textContent = t.useCases[i].title;
      card.querySelector("p").textContent  = t.useCases[i].desc;
    });

    // Transformation
    document.querySelector(".transform-text").innerHTML = t.transformText;

    // Early access
    document.querySelector(".early-container h3").textContent = t.earlyTitle;
    document.querySelectorAll(".early-benefits li")
      .forEach((el, i) => (el.textContent = t.earlyBenefits[i]));
    document.querySelector(".email-text").textContent   = t.preferEmail;
    document.querySelector(".trust-text").textContent   = t.trustText;

    if (emailWaitlistInput) emailWaitlistInput.placeholder = t.emailPlaceholder;

    // WhatsApp modal
    document.querySelector("#whatsappModal h2").textContent             = t.whatsappTitle;
    document.querySelector("#whatsappModal p").textContent              = t.whatsappDesc;
    document.querySelector(".whatsapp-form .input-field").placeholder   = t.namePlaceholder;
    document.querySelector(".phone-input").placeholder                  = t.phonePlaceholder;
    document.querySelector(".form-note").textContent                    = t.formNote;

    const whatsappSubmitBtn = document.querySelector(".whatsapp-form .submit-btn");
    if (whatsappSubmitBtn) whatsappSubmitBtn.textContent = t.cta;

    document.querySelectorAll(".email-submit-btn")
      .forEach((btn) => (btn.textContent = t.cta));

    // Waitlist modal
    const modalTitle = document.querySelector("#waitlistModal h2");
    const modalDesc  = document.querySelector("#waitlistModal p");
    if (modalTitle) modalTitle.textContent = t.waitlistTitle;
    if (modalDesc)  modalDesc.textContent  = t.waitlistDesc;

    document.querySelectorAll(".popup-benefits li")
      .forEach((el, i) => (el.textContent = t.popupBenefits[i]));

    // Footer
    const footerSpans = document.querySelectorAll(".footer-top span");
    footerSpans[0].textContent = t.footerTop[0];
    footerSpans[2].textContent = t.footerTop[1];
    document.querySelectorAll(".footer-bottom a")
      .forEach((el, i) => (el.textContent = t.footerLinks[i]));

    // Timer labels
    if (timerLabel && timerDigits) {
      if (timerEl.classList.contains("closed")) {
        timerDigits.textContent = t.timerClosed;
        timerLabel.textContent  = "";
      } else {
        timerLabel.textContent = t.timerRunning;
      }
    }

    // RTL / direction
    document.body.classList.toggle("rtl", lang === "ar");
    document.documentElement.dir  = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.getElementById("langToggle").textContent =
      lang === "ar" ? "English" : "العربية";

    currentLang = lang;
  };

  /* ----------- LANGUAGE DETECTION ----------- */
  const detectInitialLanguage = () => {
    const browserLang = (navigator.languages?.[0] ?? navigator.language ?? "en").toLowerCase();
    if (browserLang.startsWith("ar")) return "ar";

    const gccTimezones = [
      "Asia/Kuwait", "Asia/Riyadh", "Asia/Dubai",
      "Asia/Qatar",  "Asia/Bahrain", "Asia/Muscat",
    ];
    if (gccTimezones.includes(Intl.DateTimeFormat().resolvedOptions().timeZone)) {
      return "ar";
    }
    return "en";
  };

  setLanguage(detectInitialLanguage());

  /* ----------- LANGUAGE TOGGLE ----------- */
  langToggle?.addEventListener("click", () => {
    if (!langRoot) return;
    langRoot.classList.remove("active");
    setTimeout(() => {
      setLanguage(currentLang === "en" ? "ar" : "en");
      requestAnimationFrame(() => langRoot.classList.add("active"));
    }, 380);
  });

  /* ----------- EARLY ACCESS COUNTDOWN ----------- */
  const initEarlyAccessTimer = () => {
    if (!timerEl || !timerDigits || !timerLabel) return;

    let timerData = JSON.parse(localStorage.getItem(TIMER_KEY) || "{}");
    if (!timerData.endTime && !timerData.resetTime) {
      timerData = { endTime: Date.now() + TIMER_DURATION };
      localStorage.setItem(TIMER_KEY, JSON.stringify(timerData));
    }

    const updateTimer = () => {
      const now  = Date.now();
      timerData  = JSON.parse(localStorage.getItem(TIMER_KEY) || "{}");
      const { endTime, resetTime } = timerData;

      // Phase 1: normal countdown
      if (endTime && now < endTime) {
        const diff    = endTime - now;
        const hours   = Math.floor(diff / 3_600_000);
        const minutes = Math.floor((diff / 60_000) % 60);
        const seconds = Math.floor((diff / 1_000) % 60);
        const pad     = (n) => String(n).padStart(2, "0");

        timerEl.classList.remove("closed");
        timerLabel.textContent  = translations[currentLang].timerRunning;
        timerDigits.textContent = `${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`;
        return;
      }

      // Phase 2: closing message window
      if (!resetTime) {
        const newReset = now + RESET_DELAY;
        localStorage.setItem(TIMER_KEY, JSON.stringify({ resetTime: newReset }));
      }
      const { resetTime: rt } = JSON.parse(localStorage.getItem(TIMER_KEY) || "{}");
      if (rt && now < rt) {
        timerEl.classList.add("closed");
        timerLabel.textContent  = "";
        timerDigits.textContent = translations[currentLang].timerClosed;
        return;
      }

      // Phase 3: reset
      localStorage.setItem(TIMER_KEY, JSON.stringify({ endTime: Date.now() + TIMER_DURATION }));
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  };

  initEarlyAccessTimer();

  /* ----------- HERO CTA → SCROLL ----------- */
  const waitlistBtn = document.getElementById("waitlistBtn");
  if (waitlistBtn && emailWaitlistSection) {
    waitlistBtn.addEventListener("click", (e) => {
      e.preventDefault();
      emailWaitlistSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ----------- WHATSAPP MODAL ----------- */
  const openWhatsappBtn  = document.getElementById("openWhatsappForm");
  const closeWhatsappBtn = document.getElementById("closeWhatsappForm");

  if (openWhatsappBtn && whatsappModal) {
    openWhatsappBtn.addEventListener("click", () => toggleModal(whatsappModal, true));
  }
  if (closeWhatsappBtn && whatsappModal) {
    closeWhatsappBtn.addEventListener("click", () => toggleModal(whatsappModal, false));
    whatsappModal.addEventListener("click", (e) => {
      if (e.target === whatsappModal) toggleModal(whatsappModal, false);
    });
  }

  /* ----------- WAITLIST MODAL ----------- */
  const closeWaitlistBtn = document.getElementById("closeWaitlistModal");
  if (closeWaitlistBtn && waitlistModal) {
    closeWaitlistBtn.addEventListener("click", () => toggleModal(waitlistModal, false));
  }

  /* ----------- AUTO POPUP ----------- */
  setTimeout(() => {
    if (waitlistModal) toggleModal(waitlistModal, true);
  }, POPUP_DELAY);

  /* ----------- COUNTRY SELECTORS ----------- */
  // WhatsApp modal selector
  initCountrySelector({
    selectorId: "countrySelector",
    selectedId: "selectedCountry",
    dropdownId: "countryDropdown",
    onSelect: () => {
      const phoneInputEl = whatsappForm?.querySelector(".phone-input");
      const selectedEl   = document.getElementById("selectedCountry");
      if (phoneInputEl && selectedEl) {
        validatePhoneForInput(phoneInputEl, selectedEl.dataset.code || "+965");
      }
    },
  });

  // Waitlist modal selector
  initCountrySelector({
    selectorId: "countrySelectorModal",
    selectedId: "selectedCountryModal",
    dropdownId: "countryDropdownModal",
  });

  /* ----------- WHATSAPP FORM ----------- */
  if (whatsappForm) {
    const nameInputWA  = whatsappForm.querySelector(".input-field");
    const phoneInputWA = whatsappForm.querySelector(".phone-input");
    const selectedEl   = document.getElementById("selectedCountry");

    // Real-time validation
    nameInputWA?.addEventListener("input", () => validateName(nameInputWA));
    nameInputWA?.addEventListener("blur",  () => validateName(nameInputWA));

    phoneInputWA?.addEventListener("input", () => {
      phoneInputWA.value = phoneInputWA.value.replace(/\D/g, "");
      validatePhoneForInput(phoneInputWA, selectedEl?.dataset.code || "+965");
    });
    phoneInputWA?.addEventListener("blur", () => {
      validatePhoneForInput(phoneInputWA, selectedEl?.dataset.code || "+965");
    });

    whatsappForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const countryCode = selectedEl?.dataset.code || "+965";

      if (!validateName(nameInputWA)) return;
      if (!validatePhoneForInput(phoneInputWA, countryCode)) return;

      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
        body: JSON.stringify({
          name:  nameInputWA.value.trim(),
          phone: countryCode + phoneInputWA.value.trim(),
        }),
      });

      showSuccess();
      toggleModal(whatsappModal, false);
      whatsappForm.reset();
    });
  }

  /* ----------- WAITLIST PHONE FORM ----------- */
  if (waitlistPhoneForm && waitlistPhoneInput) {
    const selectedModalEl = document.getElementById("selectedCountryModal");

    waitlistPhoneInput.addEventListener("input", () => {
      waitlistPhoneInput.value = waitlistPhoneInput.value.replace(/\D/g, "");
      validatePhoneForInput(
        waitlistPhoneInput,
        selectedModalEl?.dataset.code || "+965"
      );
    });
    waitlistPhoneInput.addEventListener("blur", () => {
      validatePhoneForInput(
        waitlistPhoneInput,
        selectedModalEl?.dataset.code || "+965"
      );
    });

    waitlistPhoneForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const countryCode = selectedModalEl?.dataset.code || "+965";

      if (!validatePhoneForInput(waitlistPhoneInput, countryCode)) return;

      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
        body: JSON.stringify({
          name:  "Waitlist",
          phone: countryCode + waitlistPhoneInput.value.trim(),
        }),
      });

      showSuccess();
      toggleModal(waitlistModal, false);
      waitlistPhoneForm.reset();
    });
  }

  /* ----------- EMAIL FORMS ----------- */
  attachEmailRealtimeValidation(emailWaitlistInput);

  document.querySelectorAll(".email-form, .email-form-modal").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input[type='email']");
      if (!input || !validateEmailInput(input)) return;

      submitEmail(input.value.trim());
      showSuccess();
      toggleModal(waitlistModal, false);
      input.value = "";
    });
  });

  /* ----------- EMAIL GLOW ON SCROLL ----------- */
  const scrollToEmailWaitlist = () => {
    if (!emailWaitlistSection) return;
    emailWaitlistSection.scrollIntoView({ behavior: "smooth", block: "start" });

    if (emailWaitlistInput) {
      setTimeout(() => {
        emailWaitlistInput.focus();
        emailWaitlistInput.classList.add("email-glow");
        setTimeout(() => emailWaitlistInput.classList.remove("email-glow"), 1600);
      }, 600);
    }
  };

  // Expose for any future button that might need it
  window.scrollToEmailWaitlist = scrollToEmailWaitlist;
});
