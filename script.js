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

  /* Featured work carousel */
  const track = document.querySelector(".work-track");
  const cards = track ? [...track.querySelectorAll(".work-card")] : [];
  const prev = document.querySelector(".work-prev");
  const next = document.querySelector(".work-next");
  let index = 0;

  function perView() {
    return window.matchMedia("(max-width: 960px)").matches ? 1 : 2;
  }

  function maxIndex() {
    return Math.max(0, cards.length - perView());
  }

  function renderCarousel() {
    if (!track || !cards.length) return;
    index = Math.min(index, maxIndex());
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 20;
    const offset = index * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;
  }

  if (prev && next && cards.length) {
    prev.addEventListener("click", () => {
      index = Math.max(0, index - 1);
      renderCarousel();
    });
    next.addEventListener("click", () => {
      index = Math.min(maxIndex(), index + 1);
      renderCarousel();
    });
    window.addEventListener("resize", () => {
      if (!reduceMotion) renderCarousel();
      else renderCarousel();
    });
    renderCarousel();
  }

  /* Year in copyright */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
