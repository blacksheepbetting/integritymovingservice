import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle, List, MapPin, Phone, X } from "@phosphor-icons/react";

const PHONE_DISPLAY = "(317) 459-6279";
const PHONE_HREF = "tel:+13174596279";

const processSteps = [
  {
    number: "01",
    title: "Before the Move",
    body: "We get to know the details of your move and build a plan that fits your needs.",
    image: "/assets/before-move.png",
    alt: "Moving consultant and customer reviewing a move plan together",
  },
  {
    number: "02",
    title: "Moving Day",
    body: "Our team arrives on time, works carefully, and keeps everything moving smoothly.",
    image: "/assets/hero-moving-crew.jpg",
    alt: "Moving crew carrying wrapped furniture toward a moving truck",
  },
  {
    number: "03",
    title: "After Arrival",
    body: "We place your items with care and make sure you’re happy with everything.",
    image: "/assets/cta-boxes.jpg",
    alt: "Mover carrying boxes from a truck toward a home",
  },
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
        <p>This staging preview does not send your information. Call us to continue your quote.</p>
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
      <p className="form-note">No payment required to start your quote.</p>
    </form>
  );
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const closeQuoteButton = useRef(null);

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setQuoteOpen(false);
      }
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    if (!quoteOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeQuoteButton.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [quoteOpen]);

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
          <button className="button button--primary nav-quote" type="button" onClick={() => setQuoteOpen(true)}>Get a Free Quote</button>
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
                <button className="button button--primary" type="button" onClick={() => setQuoteOpen(true)}>Get a Free Quote</button>
                <a className="phone-link" href={PHONE_HREF}><Phone size={22} weight="fill" aria-hidden="true" /> Call {PHONE_DISPLAY}</a>
              </div>
            </div>
          </div>
        </section>

        <div className="red-band" aria-hidden="true" />

        <section className="story section" id="about" aria-labelledby="story-title">
          <div className="story-image">
            <img src="/assets/careful-wrapping.jpg" alt="Mover carefully wrapping a chair inside a home" />
          </div>
          <div className="story-copy">
            <div className="section-kicker" aria-hidden="true" />
            <p className="eyebrow eyebrow--dark">A straightforward moving experience</p>
            <h2 id="story-title">A Clearer Way to Move</h2>
            <p>Moving can feel like a lot—there are many details to manage and plenty that can go wrong.</p>
            <p>We keep it simple. We listen, plan carefully, and show up ready to do the job right.</p>
            <p>From careful packing to smooth delivery, our team treats your home and belongings with respect—just like we would our own.</p>
            <p className="story-signoff">Clear communication. Careful hands.<br />A better moving experience.</p>
          </div>
        </section>

        <section className="process section" id="services" aria-labelledby="process-title">
          <h2 className="visually-hidden" id="process-title">A simple moving process</h2>
          <div className="process-grid">
            {processSteps.map(({ number, title, body, image, alt }) => (
              <article className="process-step" key={number}>
                <div className="step-heading"><span>{number}</span><h3>{title}</h3></div>
                <img src={image} alt={alt} />
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="closing" id="contact" aria-labelledby="closing-title">
          <div className="closing-copy">
            <div className="closing-message">
              <div className="section-kicker" aria-hidden="true" />
              <h2 id="closing-title">Let’s Make Your Move Simple.</h2>
              <p>Tell us where you’re going and when. We’ll use those details to start the conversation.</p>
            </div>
            <div className="closing-actions">
              <button className="button button--primary" type="button" onClick={() => setQuoteOpen(true)}>Get a Free Quote</button>
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

      {quoteOpen && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setQuoteOpen(false);
        }}>
          <section className="quote-modal" role="dialog" aria-modal="true" aria-label="Request a moving quote">
            <button
              className="modal-close"
              type="button"
              aria-label="Close quote form"
              onClick={() => setQuoteOpen(false)}
              ref={closeQuoteButton}
            >
              <X size={28} weight="bold" aria-hidden="true" />
            </button>
            <QuoteForm />
          </section>
        </div>
      )}
    </>
  );
}
