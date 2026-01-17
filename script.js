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
      snackCTA: "Get 10% early access by joining our private WhatsApp group",
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
        "✔ 10% launch-only pricing"
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
      snackCTA: "احصل على خصم 10٪ مبكرًا عبر الانضمام إلى مجموعة واتساب الخاصة بنا",
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
        "✔ خصم إطلاق 10٪"
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
    $$(".cta-btn, .whatsapp-btn").forEach(btn => btn.textContent = t.cta);

    $(".snack-text h2").innerHTML = t.snackTitle;
    $(".snack-text p").textContent = t.snackDesc;
    $(".snack-cta-text").textContent = t.snackCTA;
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

  setLanguage("en");

  langToggle.addEventListener("click", () => {
    setLanguage(currentLang === "en" ? "ar" : "en");
  });

});
