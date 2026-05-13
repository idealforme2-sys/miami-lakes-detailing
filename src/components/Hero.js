import { instagramUrl } from "../data/site.js";
import { InstagramIcon } from "./icons.js";

export function Hero() {
  return `
    <section class="hero" aria-labelledby="hero-title">
      <img class="hero-image" src="/heronew.jpg" alt="Premium detailing finish on a clean vehicle" />
      <div class="hero-shade"></div>
      <div class="hero-content">
        <p class="eyebrow">Premium wash bay energy. Miami Lakes speed.</p>
        <h1 id="hero-title">
          <span>Miami Lakes</span>
          <span>Detailing</span>
        </h1>
        <p class="hero-copy">
          Premium shampoo. Mirror-finish wax. Add a full interior vacuum for just $29.
          Fast service, zero hassle. Pull up and let us handle the rest.
        </p>
        <div class="hero-actions">
          <a class="button button-primary" href="#booking">Get a Quick Quote</a>
          <a class="button button-secondary" href="#services">View Services</a>
          <a class="button button-social" href="${instagramUrl}" target="_blank" rel="noreferrer">
            ${InstagramIcon()}
            Instagram
          </a>
        </div>
        <dl class="hero-stats" aria-label="Service highlights">
          <div><dt>Typical Slot</dt><dd>45-90 Min</dd></div>
          <div><dt>Add-on</dt><dd>$29 Vacuum</dd></div>
          <div><dt>Area</dt><dd>Miami Lakes</dd></div>
        </dl>
      </div>
    </section>
  `;
}
