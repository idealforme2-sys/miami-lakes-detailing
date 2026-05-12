const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const preloader = document.querySelector("[data-preloader]");
const packageSelect = document.querySelector("[data-package-select]");
const quoteForm = document.querySelector("[data-quote-form]");
const formNote = document.querySelector("[data-form-note]");
document.documentElement.dataset.motion = "full";
const prefersReducedMotion = false;

window.addEventListener("load", () => {
  window.setTimeout(() => {
    preloader?.classList.add("is-hidden");
  }, 1600);
});

const syncHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

const closeNav = () => {
  nav?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Open navigation");
};

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open") || false;
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

nav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    closeNav();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNav();
  }
});

document.querySelectorAll("[data-showcase-card]").forEach((card) => {
  let media = card.querySelector("[data-showcase-media]");
  const counter = card.querySelector("[data-showcase-counter]");
  const items = Array.from(card.querySelectorAll("[data-showcase-src]"))
    .map((item) => item.dataset.showcaseSrc)
    .filter(Boolean);
  let activeIndex = 0;
  let imageTimer;

  if (!media || !counter || items.length === 0) {
    return;
  }

  const isImage = (src) => /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(src);

  const scheduleNextImage = () => {
    window.clearTimeout(imageTimer);
    if (items.length > 1 && isImage(items[activeIndex])) {
      imageTimer = window.setTimeout(() => render(activeIndex + 1), 1500);
    }
  };

  const bindVideoEnd = () => {
    media.addEventListener("ended", () => {
      if (items.length > 1) {
        render(activeIndex + 1);
      }
    });
  };

  const render = (nextIndex) => {
    window.clearTimeout(imageTimer);
    activeIndex = (nextIndex + items.length) % items.length;
    const src = items[activeIndex];
    const shouldUseImage = isImage(src);
    const shouldSwapElement = shouldUseImage ? media.tagName !== "IMG" : media.tagName !== "VIDEO";

    if (shouldSwapElement) {
      const nextMedia = document.createElement(shouldUseImage ? "img" : "video");
      nextMedia.dataset.showcaseMedia = "";
      nextMedia.className = media.className;
      nextMedia.style.opacity = "0.35";

      if (!shouldUseImage) {
        nextMedia.muted = true;
        nextMedia.playsInline = true;
        nextMedia.preload = "metadata";
      }

      media.replaceWith(nextMedia);
      media = nextMedia;
      bindVideoEnd();
    } else {
      media.style.opacity = "0.35";
    }

    window.setTimeout(() => {
      media.src = src;
      if (shouldUseImage) {
        media.alt = card.querySelector(".showcase-copy h3")?.textContent || "Miami Lakes Detailing showcase";
      } else {
        media.loop = items.length < 2;
        media.load?.();
        media.play?.().catch(() => {});
      }
      media.style.opacity = "1";
      counter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
      scheduleNextImage();
    }, 160);
  };

  if (items.length > 1) {
    card.classList.add("has-carousel");
  }

  card.querySelector(".showcase-prev")?.addEventListener("click", () => {
    render(activeIndex - 1);
  });
  card.querySelector(".showcase-next")?.addEventListener("click", () => {
    render(activeIndex + 1);
  });

  bindVideoEnd();

  render(0);
});

document.querySelectorAll(".choose-package").forEach((button) => {
  button.addEventListener("click", () => {
    const selectedPackage = button.dataset.package;

    if (packageSelect && selectedPackage) {
      packageSelect.value = selectedPackage;
    }

    document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth", block: "start" });

    if (formNote && selectedPackage) {
      formNote.textContent = `${selectedPackage} selected. Add your contact and vehicle details, then send the request.`;
    }
  });
});

document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const isOpen = item?.classList.toggle("is-open") || false;
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

const premiumHoverItems = document.querySelectorAll(
  [
    ".service-card",
    ".package-card",
    ".showcase-card",
    ".review-card",
    ".finish-media",
    ".map-frame",
    ".faq-item",
    ".why-panel li",
    ".quote-form",
  ].join(",")
);

if (!prefersReducedMotion) {
  premiumHoverItems.forEach((item) => {
    const maxRotate = item.classList.contains("package-card") ? 7 : 4;

    item.classList.add("premium-hover");

    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      const rotateY = (x - 0.5) * maxRotate;
      const rotateX = (0.5 - y) * maxRotate;

      item.classList.add("is-pointer-active");
      item.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
      item.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
    });

    item.addEventListener("pointerleave", () => {
      item.classList.remove("is-pointer-active");
      item.style.setProperty("--tilt-x", "0deg");
      item.style.setProperty("--tilt-y", "0deg");
    });
  });
}

quoteForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(quoteForm);
  const name = data.get("name") || "Driver";
  const phone = data.get("phone") || "Not provided";
  const email = data.get("email") || "Not provided";
  const vehicle = data.get("vehicle") || "Not provided";
  const service = data.get("package");
  const vacuum = data.get("vacuum") ? " with the $29 vacuum add-on" : "";
  const recipient = quoteForm.dataset.recipientEmail || "";
  const requestDetails = [
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

  navigator.clipboard?.writeText(requestDetails).catch(() => {});

  if (recipient) {
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(requestDetails)}`;
  }

  if (formNote) {
    formNote.textContent = `Thanks, ${name}. Your ${service}${vacuum} request is ready in your email app and copied for backup.`;
  }
});

const revealGroups = [
  { selector: ".section-heading, .showcase-heading, .word-heading, .faq-heading, .booking-copy, .final-cta-inner", type: "heading" },
  { selector: ".section-kicker, .eyebrow", type: "kicker" },
  { selector: ".showcase-card", type: "showcase" },
  { selector: ".service-card, .package-card, .review-card, .why-panel li, .faq-item", type: "card" },
  { selector: ".finish-media, .map-frame, .quote-form, .why-panel", type: "media" },
  { selector: ".finish-copy, .why-copy, .area-copy, .footer-brand p", type: "copy" },
  { selector: ".finish-list span, .area-facts span, .hero-actions .button, .hero-stats div, .signal-rail, .footer-logo-image, .footer-brand .footer-social, .footer-links a, .footer-links span, .footer-bottom > *", type: "small" },
];

const revealItems = [];
const seenRevealItems = new Set();

revealGroups.forEach((group) => {
  document.querySelectorAll(group.selector).forEach((item) => {
    if (seenRevealItems.has(item)) {
      return;
    }

    seenRevealItems.add(item);
    item.dataset.revealType = group.type;
    revealItems.push(item);
  });
});

const sectionRevealItems = document.querySelectorAll(
  [
    ".signal-strip",
    ".showcase-section",
    "#services",
    "#finish",
    ".why-section",
    "#packages",
    ".word-section",
    "#area",
    "#faq",
    "#booking",
    ".final-cta",
  ].join(",")
);

const revealInViewport = () => {
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  revealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const isNearViewport = rect.top < viewportHeight * 0.94 && rect.bottom > viewportHeight * 0.04;

    if (isNearViewport) {
      item.classList.add("is-visible");
    }
  });

  sectionRevealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const isNearViewport = rect.top < viewportHeight * 0.98 && rect.bottom > 0;

    if (isNearViewport) {
      item.classList.add("section-lux-visible");
    }
  });
};

const bindRevealFallback = () => {
  if (prefersReducedMotion) {
    return;
  }

  const sync = () => window.requestAnimationFrame(revealInViewport);

  sync();
  window.setTimeout(sync, 220);
  window.addEventListener("load", sync, { once: true });
  window.addEventListener("pageshow", sync);
  window.addEventListener("resize", sync, { passive: true });
  window.addEventListener("scroll", sync, { passive: true });
};

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
  );

  revealItems.forEach((item, index) => {
    item.classList.add("reveal-ready", `reveal-${item.dataset.revealType}`);
    item.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 70}ms`);
    window.requestAnimationFrame(() => revealObserver.observe(item));
  });

  const sectionObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-lux-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -18% 0px", threshold: 0.1 }
  );

  sectionRevealItems.forEach((item) => {
    item.classList.add("section-lux-ready");
    sectionObserver.observe(item);
  });

  bindRevealFallback();
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
  sectionRevealItems.forEach((item) => item.classList.add("section-lux-visible"));
}
