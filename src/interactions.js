const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initPreloader(root) {
  const preloader = root.querySelector("[data-preloader]");
  const hide = () => preloader?.classList.add("is-hidden");

  window.addEventListener("load", () => window.setTimeout(hide, 950), { once: true });
  window.setTimeout(hide, 2200);
}

function initHeader(root) {
  const header = root.querySelector("[data-header]");
  const nav = root.querySelector("[data-nav]");
  const toggle = root.querySelector("[data-nav-toggle]");

  const syncHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 20);
  const closeNav = () => {
    nav?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Open navigation");
  };

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });
  toggle?.addEventListener("click", () => {
    const isOpen = nav?.classList.toggle("is-open") || false;
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });
  nav?.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeNav();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });
}

function initShowcases(root) {
  root.querySelectorAll("[data-showcase-card]").forEach((card) => {
    const media = card.querySelector("[data-showcase-media]");
    const counter = card.querySelector("[data-showcase-counter]");
    const sources = Array.from(card.querySelectorAll("[data-showcase-src]")).map((item) => item.dataset.showcaseSrc).filter(Boolean);
    let active = 0;
    let timer = 0;

    if (!media || !counter || sources.length === 0) return;
    card.classList.toggle("has-carousel", sources.length > 1);

    const render = (next) => {
      window.clearTimeout(timer);
      active = (next + sources.length) % sources.length;
      media.style.opacity = "0.35";
      window.setTimeout(() => {
        media.src = sources[active];
        media.loop = sources.length < 2;
        media.load();
        media.play().catch(() => {});
        media.style.opacity = "1";
        counter.textContent = `${String(active + 1).padStart(2, "0")} / ${String(sources.length).padStart(2, "0")}`;
        if (sources.length > 1) timer = window.setTimeout(() => render(active + 1), 5200);
      }, 160);
    };

    card.querySelector(".showcase-prev")?.addEventListener("click", () => render(active - 1));
    card.querySelector(".showcase-next")?.addEventListener("click", () => render(active + 1));
    media.addEventListener("ended", () => {
      if (sources.length > 1) render(active + 1);
    });
    render(0);
  });
}

function initPackages(root) {
  const packageSelect = root.querySelector("[data-package-select]");
  const note = root.querySelector("[data-form-note]");

  root.querySelectorAll(".choose-package").forEach((button) => {
    button.addEventListener("click", () => {
      if (packageSelect) packageSelect.value = button.dataset.package || packageSelect.value;
      root.querySelector("#booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
      if (note) note.textContent = `${button.dataset.package} selected. Add your contact and vehicle details, then send the request.`;
    });
  });
}

function initFaq(root) {
  root.querySelectorAll(".faq-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const isOpen = item?.classList.toggle("is-open") || false;
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });
}

function initQuoteForm(root) {
  const form = root.querySelector("[data-quote-form]");
  const note = root.querySelector("[data-form-note]");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get("name") || "Driver";
    const phone = data.get("phone") || "Not provided";
    const email = data.get("email") || "Not provided";
    const vehicle = data.get("vehicle") || "Not provided";
    const service = data.get("package") || "Shampoo Reset";
    const recipient = form.dataset.recipientEmail || "";
    const details = [
      "Miami Lakes Detailing quote request",
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Vehicle: ${vehicle}`,
      `Package: ${service}`,
      `Vacuum add-on: ${data.get("vacuum") ? "Yes" : "No"}`,
    ].join("\n");
    const subject = `Quote request: ${service} for ${vehicle}`;

    navigator.clipboard?.writeText(details).catch(() => {});
    if (recipient) {
      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(details)}`;
    }
    if (note) note.textContent = `Thanks, ${name}. Your request is ready in your email app and copied for backup.`;
  });
}

function initReveal(root) {
  const items = root.querySelectorAll(".section-kicker, .section-heading, .showcase-card, .service-card, .finish-media, .finish-copy, .why-copy, .why-panel, .package-card, .word-heading, .review-card, .area-copy, .map-frame, .faq-item, .quote-form, .booking-copy");

  if (!("IntersectionObserver" in window) || reducedMotion()) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });

  items.forEach((item, index) => {
    item.classList.add("reveal-ready");
    item.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 55}ms`);
    observer.observe(item);
  });
}

export function initInteractions(root = document) {
  initPreloader(root);
  initHeader(root);
  initShowcases(root);
  initPackages(root);
  initFaq(root);
  initQuoteForm(root);
  initReveal(root);
}
