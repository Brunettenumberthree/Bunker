// Lock landing page scroll until Enter
document.documentElement.style.overflow = "hidden";
document.body.style.overflow = "hidden";
// Select elements
const heroTextTitle = document.querySelectorAll(".hero_text_title span");
const tagline = document.querySelector(".hero_text_tagline");
const enterBtn = document.querySelector(".Enter");
const bgVideo = document.querySelector(".hero_bg_video");

// Mobile/iOS autoplay kickstart (autoplay requires muted + playsinline)
document.addEventListener("DOMContentLoaded", () => {
  if (!bgVideo) return;

  const playPromise = bgVideo.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // If blocked, retry on first interaction
      const resume = () => {
        bgVideo.play().catch(() => {});
        document.removeEventListener("touchstart", resume);
        document.removeEventListener("click", resume);
      };
      document.addEventListener("touchstart", resume, { once: true });
      document.addEventListener("click", resume, { once: true });
    });
  }
});

// GSAP animations
if (typeof gsap !== "undefined") {
  const heroSectionTL = gsap.timeline({ defaults: { ease: "power4.out" } });

  // Hide tagline + button until reveal
  gsap.set(tagline, { autoAlpha: 0, y: 10 });
  gsap.set(enterBtn, { autoAlpha: 0, y: 10 });

  // Title stagger reveal (fixed version of your original)
  heroSectionTL.from(heroTextTitle, {
    duration: 1.2,
    autoAlpha: 0,
    yPercent: 100,    // GSAP-friendly transform (not transform: "translateY(...)")
    stagger: 0.10
  });

  // Tagline reveal
  heroSectionTL.to(tagline, {
    duration: 0.9,
    autoAlpha: 1,
    y: 0
  }, "-=0.2");

  // Button reveal
  heroSectionTL.to(enterBtn, {
    duration: 0.8,
    autoAlpha: 1,
    y: 0
  }, "-=0.35");

} else {
  // Fallback if GSAP fails
  if (tagline) tagline.style.opacity = "1";
  if (enterBtn) enterBtn.style.opacity = "1";
}

document.addEventListener("DOMContentLoaded", () => {

  const enterBtn = document.querySelector(".Enter");
  const transition = document.querySelector(".enter_transition");
  const titleCard = document.querySelector(".enter_title_card");
  const header = document.querySelector(".site_header");
  const hero = document.querySelector(".hero");
  const mainEl = document.querySelector("main");
  const target = document.querySelector("#archive");
  const video = document.querySelector(".hero_bg_video");
  const enterSound = document.querySelector("#enterSound");

  if (!enterBtn) return;

  enterBtn.addEventListener("click", () => {

    // mark entered immediately
    document.body.classList.add("entered");

    // play sound immediately (gesture-safe)
    if (enterSound) {
      enterSound.currentTime = 0;
      enterSound.play().catch(() => {});
    }

    // fade to black
    if (transition) transition.classList.add("active");

    // stop and unload video
    if (video) {
      video.pause();
      video.removeAttribute("src");
      while (video.firstChild) video.removeChild(video.firstChild);
      video.load();
    }

    // show entering text
    setTimeout(() => {
      if (titleCard) titleCard.classList.add("active");
    }, 600);

    // reveal site
    setTimeout(() => {

      if (mainEl) mainEl.classList.add("entered");

      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";

      if (header) header.classList.add("active");

      // permanently remove hero so you can't scroll back
      if (hero) hero.style.display = "none";

      if (target) target.scrollIntoView({ behavior: "auto", block: "start" });

    }, 1100);

    // fade back in
    setTimeout(() => {
      if (titleCard) titleCard.classList.remove("active");
      if (transition) transition.classList.remove("active");
    }, 1900);

  });

});
