import { useEffect, useState } from "react";
import {
  ArrowRight,
  Buildings,
  CalendarBlank,
  CheckCircle,
  House,
  List,
  MapPin,
  Package,
  Phone,
  Truck,
  X,
} from "@phosphor-icons/react";

const PHONE_DISPLAY = "(317) 459-6279";
const PHONE_HREF = "tel:+13174596279";

const processSteps = [
  {
    number: "01",
    title: "Before the Move",
    body: "Tell us the details. We’ll help organize a clear plan for your move.",
    Icon: CalendarBlank,
  },
  {
    number: "02",
    title: "Moving Day",
    body: "Your moving plan, timing, and key details stay easy to understand.",
    Icon: Truck,
  },
  {
    number: "03",
    title: "After Arrival",
    body: "A focused finish helps make the transition into your new space simpler.",
    Icon: House,
  },
];

const services = [
  { title: "Residential Moving", body: "Moving support for houses and other residential spaces.", Icon: House },
  { title: "Apartment Moving", body: "A plan built around entrances, stairs, elevators, and timing.", Icon: Buildings },
  { title: "Packing Services", body: "Packing support designed around your move and belongings.", Icon: Package },
  { title: "Loading & Unloading", body: "Help with the careful lifting at either end of your move.", Icon: Truck },
];

function Brand() {
  return (
    <a className="brand" href="#home" aria-label="Integrity Moving Service home">
      <span>Integrity</span>
      <small>Moving Service</small>
    </a>
  );
}

function QuoteForm() {
  const [status, setStatus] = useState("idle");

  function submitQuote(event) {
    event.preventDefault();
    setStatus("submitting");
    window.setTimeout(() => setStatus("success"), 600);
  }

  if (status === "success") {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <CheckCircle size={54} weight="fill" aria-hidden="true" />
        <h2>Thanks — your move details are ready.</h2>
        <p>This template is not connected to a live inbox yet. Call us to continue your quote.</p>
        <a className="button button--dark" href={PHONE_HREF}>
          <Phone size={21} weight="fill" aria-hidden="true" />
          Call {PHONE_DISPLAY}
        </a>
        <button className="text-button" type="button" onClick={() => setStatus("idle")}>Start over</button>
      </div>
    );
  }

  return (
    <form className="quote-form" id="quote" onSubmit={submitQuote}>
      <div className="section-kicker" aria-hidden="true" />
      <h2>Get a Free Quote</h2>
      <p className="form-intro">Tell Us About Your Move</p>

      <label htmlFor="moving-from">Moving From</label>
      <div className="input-wrap">
        <MapPin size={21} weight="fill" aria-hidden="true" />
        <input id="moving-from" name="movingFrom" autoComplete="street-address" required />
      </div>

      <label htmlFor="moving-to">Moving To</label>
      <div className="input-wrap">
        <MapPin size={21} weight="fill" aria-hidden="true" />
        <input id="moving-to" name="movingTo" autoComplete="street-address" required />
      </div>

      <label htmlFor="move-date">Move Date</label>
      <input id="move-date" name="moveDate" type="date" required />

      <label htmlFor="phone-number">Phone Number</label>
      <div className="input-wrap">
        <Phone size={21} weight="fill" aria-hidden="true" />
        <input id="phone-number" name="phone" type="tel" inputMode="tel" autoComplete="tel" required />
      </div>

      <button className="button button--primary button--wide" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Preparing…" : "Request My Quote"}
        <ArrowRight size={21} weight="bold" aria-hidden="true" />
      </button>
      <p className="form-note">No payment required. Final form destination will be connected before launch.</p>
    </form>
  );
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className="site-header" id="home">
        <div className="phone-strip">
          <a href={PHONE_HREF}><Phone size={18} weight="fill" aria-hidden="true" /> Call {PHONE_DISPLAY}</a>
        </div>
        <div className="nav-shell">
          <Brand />
          <button
            className="menu-button"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={30} /> : <List size={30} />}
          </button>
          <nav id="primary-navigation" className={menuOpen ? "nav-links nav-links--open" : "nav-links"} aria-label="Primary navigation">
            <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </nav>
          <a className="button button--primary nav-quote" href="#quote">Get a Free Quote</a>
        </div>
      </header>

      <main id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-photo">
            <img src="/assets/hero-moving-crew.jpg" alt="Moving crew carefully carrying wrapped furniture toward a moving truck" />
            <div className="hero-copy">
              <p className="eyebrow">Clear planning. Careful moving.</p>
              <h1 id="hero-title">Moving With Care.<br />From Start to Finish.</h1>
              <span className="red-rule" aria-hidden="true" />
              <p>Your move deserves a clear plan and a team that respects the details.</p>
              <div className="hero-actions">
                <a className="button button--primary" href="#quote">Get a Free Quote</a>
                <a className="phone-link" href={PHONE_HREF}><Phone size={22} weight="fill" aria-hidden="true" /> Call {PHONE_DISPLAY}</a>
              </div>
            </div>
          </div>
          <QuoteForm />
        </section>

        <div className="red-band" aria-hidden="true" />

        <section className="story section" id="about" aria-labelledby="story-title">
          <div className="story-image">
            <img src="/assets/careful-wrapping.jpg" alt="Mover carefully wrapping a chair inside a home" loading="lazy" />
          </div>
          <div className="story-copy">
            <div className="section-kicker" aria-hidden="true" />
            <p className="eyebrow eyebrow--dark">A straightforward moving experience</p>
            <h2 id="story-title">A Clearer Way to Move</h2>
            <p>Moving can feel like a lot—there are many details to manage and plenty that can change.</p>
            <p>We keep the process easy to understand: listen first, plan carefully, and keep the next step clear.</p>
            <p>The photos and final service claims in this template will be replaced or confirmed with approved client materials before launch.</p>
            <p className="story-signoff">Clear communication. Careful handling.<br />A better moving experience.</p>
          </div>
        </section>

        <section className="process section" aria-labelledby="process-title">
          <div className="section-heading">
            <p className="eyebrow eyebrow--dark">What to expect</p>
            <h2 id="process-title">A Simple Moving Process</h2>
          </div>
          <div className="process-grid">
            {processSteps.map(({ number, title, body, Icon }) => (
              <article className="process-step" key={number}>
                <div className="step-top"><span>{number}</span><Icon size={48} weight="fill" aria-hidden="true" /></div>
                <h3>{title}</h3>
                <span className="mini-rule" aria-hidden="true" />
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="services section" id="services" aria-labelledby="services-title">
          <div className="section-heading">
            <p className="eyebrow eyebrow--dark">Ways we can help</p>
            <h2 id="services-title">Moving Services</h2>
          </div>
          <div className="services-grid">
            {services.map(({ title, body, Icon }) => (
              <article className="service" key={title}>
                <Icon size={50} weight="fill" aria-hidden="true" />
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
          <p className="approval-note">Service availability and service areas are draft content pending written client approval.</p>
        </section>

        <section className="closing" id="contact" aria-labelledby="closing-title">
          <div className="closing-photo" aria-hidden="true"><img src="/assets/cta-boxes.jpg" alt="" loading="lazy" /></div>
          <div className="closing-copy">
            <div className="section-kicker" aria-hidden="true" />
            <h2 id="closing-title">Let’s Make Your Move Simple.</h2>
            <p>Tell us where you’re going and when. We’ll use those details to start the conversation.</p>
            <div className="closing-actions">
              <a className="button button--primary" href="#quote">Get a Free Quote</a>
              <a className="phone-link" href={PHONE_HREF}><Phone size={22} weight="fill" aria-hidden="true" /> Call {PHONE_DISPLAY}</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <Brand />
        <p>Pre-execution website template. Services, areas, photographs, and claims require approval before publication.</p>
        <a href="#home">Back to top</a>
      </footer>

      <a className="mobile-call" href={PHONE_HREF} aria-label={`Call Integrity Moving Service at ${PHONE_DISPLAY}`}>
        <Phone size={23} weight="fill" aria-hidden="true" /> Call Now
      </a>
    </>
  );
}
