const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const preloader = document.querySelector("[data-preloader]");
const preloaderSegments = Array.from(document.querySelectorAll(".preloader-loader span"));
const packageSelect = document.querySelector("[data-package-select]");
const quoteForm = document.querySelector("[data-quote-form]");
const formNote = document.querySelector("[data-form-note]");
document.documentElement.dataset.motion = "full";
const forceFullMotion = document.documentElement.dataset.motion === "full";
const prefersReducedMotion = forceFullMotion ? false : window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let revealInitialized = false;
let preloaderValue = 0;
let preloaderFrame;
let preloaderHidden = false;
let preloaderLoadedAt = null;
const preloaderStartedAt = window.performance.now();
const PRELOADER_MIN_DURATION = 2200;
const PRELOADER_FINISH_DURATION = 520;

const setPreloaderProgress = (value) => {
  const clamped = Math.max(0, Math.min(100, value));
  const segmentSize = preloaderSegments.length ? 100 / preloaderSegments.length : 100;

  preloaderSegments.forEach((segment, index) => {
    const start = index * segmentSize;
    const fill = Math.max(0, Math.min(1, (clamped - start) / segmentSize));
    segment.style.setProperty("--segment-fill", fill.toFixed(3));
  });
};

const animatePreloaderProgress = () => {
  const now = window.performance.now();
  const elapsed = now - preloaderStartedAt;
  let target = Math.min(90, (elapsed / PRELOADER_MIN_DURATION) * 90);

  if (preloaderLoadedAt !== null) {
    const finishElapsed = Math.max(0, now - preloaderLoadedAt);
    const finishRatio = Math.min(1, finishElapsed / PRELOADER_FINISH_DURATION);
    target = 90 + finishRatio * 10;
  }

  preloaderValue += (target - preloaderValue) * 0.18;

  if (preloaderLoadedAt !== null && target >= 100 && 100 - preloaderValue < 0.18) {
    preloaderValue = 100;
  }

  setPreloaderProgress(preloaderValue);

  const minimumElapsed = elapsed >= PRELOADER_MIN_DURATION;
  const finishElapsed = preloaderLoadedAt !== null && now - preloaderLoadedAt >= PRELOADER_FINISH_DURATION;

  if (preloaderLoadedAt !== null && minimumElapsed && finishElapsed && preloaderValue >= 99.94) {
    preloaderHidden = true;
    preloader?.classList.add("is-hidden");
    window.setTimeout(() => {
      window.requestAnimationFrame(startExperience);
    }, 240);
    return;
  }

  preloaderFrame = window.requestAnimationFrame(animatePreloaderProgress);
};

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

  const waitForMediaReady = (element, shouldUseImage, callback) => {
    if (shouldUseImage) {
      if (element.complete && element.naturalWidth > 0) {
        callback();
        return;
      }

      element.addEventListener("load", callback, { once: true });
      element.addEventListener("error", callback, { once: true });
      return;
    }

    const ready = () => {
      element.removeEventListener("loadeddata", ready);
      element.removeEventListener("error", ready);
      callback();
    };

    if (element.readyState >= 2) {
      callback();
      return;
    }

    element.addEventListener("loadeddata", ready, { once: true });
    element.addEventListener("error", ready, { once: true });
  };

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
    card.classList.add("is-transitioning");

    if (shouldSwapElement) {
      const nextMedia = document.createElement(shouldUseImage ? "img" : "video");
      nextMedia.dataset.showcaseMedia = "";
      nextMedia.className = media.className;
      nextMedia.style.opacity = "0";

      if (!shouldUseImage) {
        nextMedia.muted = true;
        nextMedia.playsInline = true;
        nextMedia.preload = "metadata";
      }

      media.replaceWith(nextMedia);
      media = nextMedia;
      bindVideoEnd();
    } else {
      media.style.opacity = "0.18";
      media.style.transform = "scale(1.06)";
      media.style.filter = "saturate(0.82) blur(2px)";
    }

    media.src = src;

    if (shouldUseImage) {
      media.alt = card.querySelector(".showcase-copy h3")?.textContent || "Miami Lakes Detailing showcase";
    } else {
      media.loop = items.length < 2;
      media.load?.();
    }

    waitForMediaReady(media, shouldUseImage, () => {
      if (!shouldUseImage) {
        media.play?.().catch(() => {});
      }

      counter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
      media.style.opacity = "1";
      media.style.transform = "scale(1)";
      media.style.filter = "";

      window.setTimeout(() => {
        card.classList.remove("is-transitioning");
        scheduleNextImage();
      }, 180);
    });
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

const revealGroupConfigs = [
  {
    root: ".hero-content",
    includeRoot: false,
    items: [".eyebrow", "h1", ".hero-copy", ".hero-actions .button", ".hero-stats div"],
  },
  {
    root: ".showcase-section",
    includeRoot: false,
    items: [".section-kicker", ".showcase-heading", ".showcase-card"],
  },
  {
    root: "#services",
    includeRoot: false,
    items: [".section-kicker", ".section-heading", ".service-card"],
  },
  {
    root: "#finish",
    includeRoot: false,
    items: [".finish-media", ".finish-copy", ".finish-list span"],
  },
  {
    root: ".why-section",
    includeRoot: false,
    items: [".why-copy", ".why-copy .button", ".why-meter", ".why-panel"],
  },
  {
    root: "#packages",
    includeRoot: false,
    items: [".section-kicker", ".section-heading", ".package-card"],
  },
  {
    root: ".word-section",
    includeRoot: false,
    items: [".word-heading", ".review-card"],
  },
  {
    root: "#area",
    includeRoot: false,
    items: [".section-kicker", ".area-copy", ".area-facts span", ".map-frame", ".map-label"],
  },
  {
    root: "#faq",
    includeRoot: false,
    items: [".faq-heading", ".faq-item"],
  },
  {
    root: "#booking",
    includeRoot: false,
    items: [".booking-copy", ".quote-form"],
  },
  {
    root: ".final-cta",
    includeRoot: false,
    items: [".final-cta-inner", ".eyebrow", ".hero-actions .button"],
  },
  {
    root: ".site-footer",
    includeRoot: false,
    items: [".footer-logo", ".footer-brand p", ".footer-brand .footer-social", ".footer-links a", ".footer-links span", ".footer-bottom > *"],
  },
];

const revealGroups = revealGroupConfigs
  .map((config) => {
    const group = document.querySelector(config.root);

    if (!group) {
      return null;
    }

    const items = [];
    const seen = new Set();

    if (config.includeRoot) {
      items.push(group);
      seen.add(group);
    }

    config.items.forEach((selector) => {
      group.querySelectorAll(selector).forEach((node) => {
        if (!seen.has(node)) {
          seen.add(node);
          items.push(node);
        }
      });
    });

    return { group, items };
  })
  .filter(Boolean);

const prepareRevealSystem = () => {
  if (prefersReducedMotion) {
    return;
  }

  revealGroups.forEach(({ items }) => {
    items.forEach((item, index) => {
      item.classList.add("reveal-ready");
      item.style.setProperty("--reveal-delay", `${Math.min(index, 7) * 55}ms`);
    });
  });
};

const revealInViewport = () => {
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  revealGroups.forEach(({ group, items }) => {
    const rect = group.getBoundingClientRect();
    const isNearViewport = rect.top < viewportHeight * 0.88 && rect.bottom > viewportHeight * 0.12;

    if (isNearViewport) {
      items.forEach((item) => item.classList.add("is-visible"));
    }
  });
};

const bindRevealFallback = () => {
  if (prefersReducedMotion) {
    return;
  }

  const sync = () => window.requestAnimationFrame(revealInViewport);

  window.setTimeout(sync, 180);
  window.setTimeout(sync, 460);
  window.addEventListener("load", sync, { once: true });
  window.addEventListener("pageshow", sync);
  window.addEventListener("resize", sync, { passive: true });
  window.addEventListener("scroll", sync, { passive: true });
};

const initRevealSystem = () => {
  if (revealInitialized) {
    return;
  }

  revealInitialized = true;

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const config = revealGroups.find(({ group }) => group === entry.target);

            config?.items.forEach((item) => item.classList.add("is-visible"));
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );

    revealGroups.forEach(({ group }) => {
      window.requestAnimationFrame(() => revealObserver.observe(group));
    });

    bindRevealFallback();
  } else {
    revealGroups.forEach(({ items }) => items.forEach((item) => item.classList.add("is-visible")));
  }
};

const startExperience = () => {
  document.body.classList.add("is-ready");
  initRevealSystem();
};

prepareRevealSystem();
setPreloaderProgress(0);

if (preloader && !prefersReducedMotion) {
  preloaderFrame = window.requestAnimationFrame(animatePreloaderProgress);
} else {
  setPreloaderProgress(100);
}

window.addEventListener("load", () => {
  if (prefersReducedMotion) {
    setPreloaderProgress(100);
    preloader?.classList.add("is-hidden");
    window.setTimeout(() => {
      window.requestAnimationFrame(startExperience);
    }, 140);
    return;
  }

  if (!preloaderHidden) {
    preloaderLoadedAt = window.performance.now();
  }
});
