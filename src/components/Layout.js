import { instagramUrl, navItems } from "../data/site.js";
import { InstagramIcon } from "./icons.js";

export function Preloader() {
  return `
    <div class="preloader" data-preloader aria-label="Miami Lakes Detailing loading screen">
      <div class="preloader-orbit">
        <img src="/MiyamiLakesLOGO.jpg" alt="Miami Lakes Detailing logo" />
      </div>
      <strong>Miami Lakes Detailing</strong>
      <span>Premium Mobile Detailing</span>
    </div>
  `;
}

export function Header() {
  const links = navItems.map(([label, href]) => `<a href="${href}">${label}</a>`).join("");

  return `
    <header class="site-header" data-header>
      <a class="brand-mark" href="#top" aria-label="Miami Lakes Detailing home">
        <img src="/MiyamiLakesLOGO.jpg" alt="Miami Lakes Detailing" />
        <span>
          <strong>Miami Lakes</strong>
          <small>Detailing</small>
        </span>
      </a>
      <button class="nav-toggle" type="button" data-nav-toggle aria-label="Open navigation" aria-expanded="false">
        <span></span>
        <span></span>
      </button>
      <nav class="site-nav" data-nav>
        ${links}
        <a class="nav-social" href="${instagramUrl}" target="_blank" rel="noreferrer" aria-label="Instagram">
          ${InstagramIcon()}
        </a>
        <a class="nav-cta" href="#booking">Book</a>
      </nav>
    </header>
  `;
}

export function Footer() {
  return `
    <footer class="site-footer">
      <div>
        <img src="/MiyamiLakesLOGO.jpg" alt="Miami Lakes Detailing logo" />
        <p>Miami Lakes Detailing</p>
      </div>
      <p class="made-by">Made By Creative Webflow Co.</p>
      <a class="footer-social" href="${instagramUrl}" target="_blank" rel="noreferrer" aria-label="Visit Instagram">
        ${InstagramIcon()}
        Instagram
      </a>
    </footer>
  `;
}
