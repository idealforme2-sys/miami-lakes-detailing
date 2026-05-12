const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const preloader = document.querySelector("[data-preloader]");
const packageSelect = document.querySelector("[data-package-select]");
const quoteForm = document.querySelector("[data-quote-form]");
const formNote = document.querySelector("[data-form-note]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

const revealItems = document.querySelectorAll(
  [
    ".section-kicker",
    ".section-heading",
    ".showcase-card",
    ".service-card",
    ".finish-media",
    ".finish-copy",
    ".why-copy",
    ".why-panel",
    ".package-card",
    ".word-heading",
    ".review-card",
    ".area-copy",
    ".map-frame",
    ".faq-item",
    ".quote-form",
    ".final-cta-inner",
  ].join(",")
);

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
    item.classList.add("reveal-ready");
    item.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 70}ms`);
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
