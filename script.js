const waitlistBtn = document.getElementById("waitlistBtn");
const modal = document.getElementById("waitlistModal");
const closeBtn = document.querySelector(".close");
const hero = document.querySelector(".hero");

/* OPEN MODAL */
waitlistBtn.addEventListener("click", () => {
  modal.style.display = "flex";
  document.body.style.overflow = "hidden"; // lock scroll
});

/* CLOSE MODAL */
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
  document.body.style.overflow = "";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }
});

/* SCROLL BACKGROUND DEPTH */
window.addEventListener("scroll", () => {
  hero.style.setProperty("--bg-shift", `${window.scrollY * 0.15}px`);
});
