import { faqItems, marqueeItems, packages, reviews, services, showcaseItems } from "../data/site.js";

const serviceMarkup = (service) => `
  <article class="service-card">
    <img src="${service.image}" alt="${service.alt}" loading="lazy" />
    <div>
      <span>${service.number}</span>
      <h3>${service.title}</h3>
      <p>${service.copy}</p>
    </div>
    <a href="#booking" aria-label="Book ${service.title}">Book this service</a>
  </article>
`;

const hiddenSources = (media) => media.map((src) => `<span hidden data-showcase-src="${src}"></span>`).join("");

const showcaseMarkup = (item, index) => `
  <article class="showcase-card ${item.large ? "showcase-large" : ""} ${item.wide ? "showcase-wide" : ""}" data-showcase-card>
    <video src="${item.media[0]}" muted loop playsinline preload="metadata" data-showcase-media></video>
    ${hiddenSources(item.media)}
    <button type="button" class="showcase-arrow showcase-prev" aria-label="Previous Instagram reel">&lsaquo;</button>
    <button type="button" class="showcase-arrow showcase-next" aria-label="Next Instagram reel">&rsaquo;</button>
    <div class="showcase-counter" data-showcase-counter>01 / ${String(item.media.length).padStart(2, "0")}</div>
    <a class="showcase-source" href="${item.link}" target="_blank" rel="noreferrer">View on Instagram</a>
    <div class="showcase-copy">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <h3>${item.title}</h3>
      <p>${item.copy}</p>
    </div>
  </article>
`;

export function Marquee() {
  const group = marqueeItems.map((item) => `<span>${item}</span>`).join("");

  return `
    <section class="signal-strip" aria-label="Popular detailing services">
      <div class="signal-rail">
        <div class="signal-track">
          <div class="signal-group">${group}</div>
          <div class="signal-group" aria-hidden="true">${group}</div>
        </div>
      </div>
    </section>
  `;
}

export function Showcase() {
  return `
    <section class="showcase-section" id="showcases">
      <div class="section showcase-inner">
        <p class="section-kicker">Real Results</p>
        <div class="section-heading showcase-heading">
          <h2>Clean Finish.</h2>
          <p>A few recent details from the feed. Open any card to see the original post on Instagram.</p>
        </div>
        <div class="showcase-grid">
          ${showcaseItems.map(showcaseMarkup).join("")}
        </div>
      </div>
    </section>
  `;
}

export function Services() {
  return `
    <section class="section split" id="services">
      <p class="section-kicker">What We Do</p>
      <div class="section-heading">
        <h2>Gloss outside. Fresh cabin inside. No appointment drama<span class="headline-dot"></span></h2>
        <p>Built for drivers who want their car to look sharp without giving up the whole day. Choose the finish, add a cabin refresh, and roll out clean.</p>
      </div>
      <div class="service-grid">
        ${services.map(serviceMarkup).join("")}
      </div>
    </section>
  `;
}

export function Finish() {
  return `
    <section class="section finish-section" id="finish">
      <div class="finish-media">
        <video src="/That%20justt%20(1).mp4" aria-label="Miami Lakes Detailing finish showcase video" muted loop autoplay playsinline preload="metadata"></video>
      </div>
      <div class="finish-copy">
        <p class="eyebrow">Cyan shine. Pink heat. Black-car depth.</p>
        <h2>That just-detailed look without the waiting-room routine.</h2>
        <p>Pull up, check in, and let the crew handle the shampoo, wax, wheels, glass, and interior crumbs. The service flow is fast, direct, and made for daily drivers that still deserve a premium finish.</p>
        <div class="finish-list">
          <span>Paint-safe wash method</span>
          <span>Gloss wax upgrade</span>
          <span>Vacuum add-on</span>
          <span>Same-day friendly</span>
        </div>
      </div>
    </section>
  `;
}

export function Difference() {
  return `
    <section class="section why-section">
      <div class="why-copy">
        <p class="eyebrow">The Difference</p>
        <h2>Built for sharp cars and short waits</h2>
        <p>Premium detail energy without the slow-shop drag. Miami Lakes Detailing keeps the service direct, the finish clean, and the add-ons easy to understand.</p>
        <a class="button button-primary" href="#booking">Book Your Detail</a>
      </div>
      <div class="why-panel">
        <div class="why-meter">
          <span>45-90 Min</span>
          <p>typical service window</p>
        </div>
        <ul>
          <li><strong>Pull-up simple</strong><span>Quick check-in, clear service choice, no appointment drama.</span></li>
          <li><strong>Premium finish</strong><span>Shampoo, gloss wax, wheels, glass, and cabin reset options.</span></li>
          <li><strong>Daily-driver friendly</strong><span>Built for used cars, new cars, work trucks, SUVs, and clean first impressions.</span></li>
          <li><strong>Easy quote flow</strong><span>Pick your package, add vacuum if needed, and send the basics fast.</span></li>
        </ul>
      </div>
    </section>
  `;
}

export function Packages() {
  return `
    <section class="section packages" id="packages">
      <p class="section-kicker">Packages</p>
      <div class="section-heading">
        <h2>Pick the level. Keep the process simple</h2>
        <p>Three clear choices for a quick clean, a fuller shine, or the complete Miami Lakes reset.</p>
      </div>
      <div class="package-grid">
        ${packages.map((item) => `
          <article class="package-card ${item.featured ? "featured" : ""}">
            <p class="package-label">${item.label}</p>
            <h3>${item.title}</h3>
            <p class="package-price">${item.price}</p>
            <ul>${item.items.map((line) => `<li>${line}</li>`).join("")}</ul>
            <button type="button" class="choose-package" data-package="${item.title}">Select</button>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

export function Reviews() {
  return `
    <section class="section word-section" id="word-of-mouth">
      <div class="word-heading">
        <div>
          <p class="section-kicker">Word Of Mouth</p>
          <h2>Clean enough to mention twice</h2>
        </div>
        <p>The goal is simple: a sharper car, a smoother day, and a finish that makes local drivers send the next one over.</p>
      </div>
      <div class="review-grid">
        ${reviews.map(([number, quote, author]) => `
          <article class="review-card">
            <span>${number}</span>
            <div aria-label="Five star review">★★★★★</div>
            <p>"${quote}"</p>
            <strong>${author}</strong>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

export function ServiceArea() {
  return `
    <section class="section service-area" id="area">
      <div class="area-copy">
        <h2>Mobile Detailing Across Miami Lakes</h2>
        <p>Based around Miami Lakes, Florida, Miami Lakes Detailing brings premium shampoo, wax, and interior vacuum services to local drivers who want a clean finish without the hassle.</p>
        <div class="area-facts">
          <span>Miami Lakes, FL</span>
          <span>Mobile & Pull-Up Service</span>
          <span>Quick Quote Booking</span>
          <span>Word-of-mouth friendly</span>
        </div>
      </div>
      <div class="map-frame">
        <iframe title="Miami Lakes service area map" src="https://www.google.com/maps?q=Miami%20Lakes%2C%20FL&z=12&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        <div class="map-label">
          <strong>Miami Lakes, FL</strong>
          <span>Primary service area</span>
        </div>
      </div>
    </section>
  `;
}

export function FAQ() {
  return `
    <section class="section faq-section" id="faq">
      <div class="faq-heading">
        <p class="eyebrow">Support</p>
        <h2>Clear Answers</h2>
      </div>
      <div class="faq-list">
        ${faqItems.map(([question, answer], index) => `
          <article class="faq-item">
            <button type="button" aria-expanded="false">
              <span>${String(index + 1).padStart(2, "0")}</span>
              ${question}
              <i aria-hidden="true">+</i>
            </button>
            <p>${answer}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}
