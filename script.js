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

  /* Animated section rules (draw + shimmer) */
  const rules = document.querySelectorAll("[data-section-rule]");
  if (rules.length) {
    const reveal = (el) => el.classList.add("is-in");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      rules.forEach(reveal);
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            reveal(entry.target);
            io.unobserve(entry.target);
          });
        },
        { threshold: 0.4 }
      );
      rules.forEach((rule) => io.observe(rule));
    }
  }

  /* Staggered list reveal */
  const revealLists = document.querySelectorAll("[data-reveal-list]");
  if (revealLists.length) {
    const reveal = (el) => el.classList.add("is-in");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealLists.forEach(reveal);
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            reveal(entry.target);
            io.unobserve(entry.target);
          });
        },
        { threshold: 0.35 }
      );
      revealLists.forEach((list) => io.observe(list));
    }
  }
})();
