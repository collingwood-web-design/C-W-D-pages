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

  /* Graphics logo mosaic — fade in as each asset arrives */
  document.querySelectorAll(".gfx-logo-grid img").forEach((img) => {
    const mark = () => img.classList.add("is-loaded");
    if (img.complete && img.naturalWidth > 0) mark();
    else {
      img.addEventListener("load", mark, { once: true });
      img.addEventListener("error", mark, { once: true });
    }
  });
  /* Back to top */
  const topBtn = document.createElement("button");
  topBtn.type = "button";
  topBtn.className = "back-to-top";
  topBtn.setAttribute("aria-label", "Back to top");
  topBtn.innerHTML = '<span class="back-to-top__arrow" aria-hidden="true"></span>';
  document.body.appendChild(topBtn);

  const toggleTopBtn = () => {
    topBtn.classList.toggle("is-visible", window.scrollY > 420);
  };
  toggleTopBtn();
  window.addEventListener("scroll", toggleTopBtn, { passive: true });
  topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* Cookie banner */
  const COOKIE_KEY = "cwd-cookie-consent";
  if (!localStorage.getItem(COOKIE_KEY)) {
    const banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Cookie notice");
    banner.innerHTML = `
      <div class="cookie-banner-inner">
        <p>We use cookies to keep the site running smoothly. See our <a href="privacy">Privacy Policy</a> for details.</p>
        <button type="button" class="btn btn-fill-red cookie-banner-accept">Got it</button>
      </div>
    `;
    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add("is-visible"));
    banner.querySelector(".cookie-banner-accept").addEventListener("click", () => {
      localStorage.setItem(COOKIE_KEY, "1");
      banner.classList.remove("is-visible");
      window.setTimeout(() => banner.remove(), 320);
    });
  }
  /* Case study letter lightbox */
  const lightbox = document.getElementById("case-study-lightbox");
  const lightboxImg = lightbox?.querySelector(".case-study-lightbox-img");
  if (lightbox && lightboxImg) {
    document.querySelectorAll("[data-lightbox]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        lightboxImg.src = trigger.getAttribute("data-lightbox-src") || "";
        lightboxImg.alt = trigger.getAttribute("data-lightbox-alt") || "";
        lightbox.showModal();
      });
    });
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) lightbox.close();
    });
  }

  /* Pulsing tip / note panels */
  const closePulseTip = (tip) => {
    const btn = tip.querySelector(".wd-pulse-tip__btn");
    const panel = tip.querySelector(".wd-pulse-tip__panel");
    if (!btn || !panel) return;
    btn.setAttribute("aria-expanded", "false");
    panel.hidden = true;
  };

  document.querySelectorAll(".wd-pulse-tip").forEach((tip) => {
    const btn = tip.querySelector(".wd-pulse-tip__btn");
    const panel = tip.querySelector(".wd-pulse-tip__panel");
    if (!btn || !panel) return;

    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const open = btn.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".wd-pulse-tip").forEach((other) => {
        if (other !== tip) closePulseTip(other);
      });
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      panel.hidden = open;
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".wd-pulse-tip")) return;
    document.querySelectorAll(".wd-pulse-tip").forEach(closePulseTip);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    document.querySelectorAll(".wd-pulse-tip").forEach(closePulseTip);
  });
})();
