import { packages, quoteEmail } from "../data/site.js";

export function Booking() {
  return `
    <section class="section booking-section" id="booking">
      <div class="booking-copy">
        <p class="section-kicker">Request Quote</p>
        <h2>Fast service, zero hassle.</h2>
        <p>Your quote request opens as an email draft so nothing gets lost. Email is optional; phone is the fastest way to reply.</p>
      </div>
      <form class="quote-form" data-quote-form data-recipient-email="${quoteEmail}">
        <label>
          <span>Name</span>
          <input name="name" autocomplete="name" placeholder="Your name" required />
        </label>
        <label>
          <span>Phone</span>
          <input name="phone" autocomplete="tel" placeholder="(305) 555-0140" required />
        </label>
        <label>
          <span>Email <em>optional</em></span>
          <input name="email" type="email" autocomplete="email" placeholder="you@example.com" />
        </label>
        <label>
          <span>Vehicle</span>
          <input name="vehicle" placeholder="SUV, sedan, truck..." required />
        </label>
        <label>
          <span>Package</span>
          <select name="package" data-package-select>
            ${packages.map((item) => `<option>${item.title}</option>`).join("")}
          </select>
        </label>
        <label class="checkbox-row">
          <input name="vacuum" type="checkbox" />
          <span>Add full interior vacuum for $29</span>
        </label>
        <button class="button button-primary" type="submit">Request Quote</button>
        <p class="form-note" data-form-note>Choose a package, add the basics, and send the request.</p>
      </form>
    </section>
  `;
}
