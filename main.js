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
  const target = document.querySelector("#home");
  const video = document.querySelector(".hero_bg_video");
  const enterSound = document.querySelector("#enterSound");

  if (!enterBtn) return;

enterBtn.addEventListener("click", () => {

  //  mark entered immediately
  document.body.classList.add("entered");

  //  play audio immediately (gesture-safe)
  if (enterSound) {
    enterSound.currentTime = 0;
    enterSound.play().catch(() => {});
  }

  //  fade to black
  if (transition) transition.classList.add("active");

  //  show title card
  setTimeout(() => {
    if (titleCard) titleCard.classList.add("active");
  }, 600);

  //  after fade: remove hero + stop video + jump to archive + show nav
  setTimeout(() => {

    // stop + unload video (CPU saver)
    if (video) {
      video.pause();
      video.removeAttribute("src");
      while (video.firstChild) video.removeChild(video.firstChild);
      video.load();
    }

    //  REMOVE hero from the DOM so you can never scroll back to it
    if (hero) hero.remove();

    // reveal site sections
    if (mainEl) mainEl.classList.add("entered");

    // enable scrolling in the site
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";

    // show navigation
    if (header) header.classList.add("active");

    // ✅ force-scroll to archive in a way that doesn't depend on scrollIntoView
    const t = document.querySelector("#archive");
    if (t) {
      const y = t.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: y, left: 0, behavior: "auto" });
      window.location.hash = "archive";
    }

  }, 1100);

  // fade back in
  setTimeout(() => {
    if (titleCard) titleCard.classList.remove("active");
    if (transition) transition.classList.remove("active");
  }, 1900);

});

});
