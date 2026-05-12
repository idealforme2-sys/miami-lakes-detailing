import { Booking } from "./components/Booking.js";
import { Footer, Header, Preloader } from "./components/Layout.js";
import { Hero } from "./components/Hero.js";
import {
  Difference,
  FAQ,
  Finish,
  Marquee,
  Packages,
  Reviews,
  ServiceArea,
  Services,
  Showcase,
} from "./components/Sections.js";

export function App() {
  return `
    ${Preloader()}
    ${Header()}
    <main id="top">
      ${Hero()}
      ${Marquee()}
      ${Showcase()}
      ${Services()}
      ${Finish()}
      ${Difference()}
      ${Packages()}
      ${Reviews()}
      ${ServiceArea()}
      ${FAQ()}
      ${Booking()}
    </main>
    ${Footer()}
  `;
}
