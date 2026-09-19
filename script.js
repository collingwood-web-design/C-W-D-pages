(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Mobile nav */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Service expand */
  document.querySelectorAll("[data-service-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".service-card");
      if (!card) return;
      card.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", card.classList.contains("is-open") ? "true" : "false");
    });
  });

  /* Client logo marquee — seamless continuous loop */
  const clientCarousel = document.querySelector(".client-carousel");
  const clientTrack = document.querySelector(".client-track");
  const clientGroup = clientTrack?.querySelector(".client-group");
  if (clientCarousel && clientTrack && clientGroup && !reduceMotion) {
    let offset = 0;
    let paused = false;
    const speed = 0.55; /* px per frame at ~60fps */

    clientCarousel.addEventListener("mouseenter", () => { paused = true; });
    clientCarousel.addEventListener("mouseleave", () => { paused = false; });
    clientCarousel.addEventListener("focusin", () => { paused = true; });
    clientCarousel.addEventListener("focusout", () => { paused = false; });

    const tick = () => {
      if (!paused) {
        offset += speed;
        const loopWidth = clientGroup.offsetWidth;
        if (loopWidth > 0 && offset >= loopWidth) offset -= loopWidth;
        clientTrack.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* Year in copyright */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
