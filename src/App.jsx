import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle, House, List, MapPin, Package, Phone, Star, Trash, Truck, Warehouse, X } from "@phosphor-icons/react";
import { getCampaignAttribution, trackEvent } from "./analytics.js";

const PHONE_DISPLAY = "(317) 459-6279";
const PHONE_HREF = "tel:+13174596279";
const GOOGLE_PROFILE_URL = "https://www.google.com/maps/place/Integrity+Moving+Service/data=!4m2!3m1!1s0x0:0xbfd72c1420f96d97";
const TURNSTILE_SITE_KEY = import.meta.env.DEV
  ? "1x00000000000000000000AA"
  : "0x4AAAAAAEP4napRLAcqwIPe";

const processSteps = [
  {
    number: "01",
    title: "Before the Move",
    body: "We get to know the details of your move and build a plan that fits your needs.",
    image: "/assets/before-move.png",
    alt: "Moving consultant and customer reviewing a move plan together",
    width: 1448,
    height: 1086,
  },
  {
    number: "02",
    title: "Moving Day",
    body: "Our team arrives on time, works carefully, and keeps everything moving smoothly.",
    image: "/assets/hero-moving-crew.jpg",
    alt: "Moving crew carrying wrapped furniture toward a moving truck",
    width: 1800,
    height: 1200,
  },
  {
    number: "03",
    title: "After Arrival",
    body: "We place your items with care and make sure you’re happy with everything.",
    image: "/assets/cta-boxes.jpg",
    alt: "Mover carrying boxes from a truck toward a home",
    width: 1800,
    height: 1013,
  },
];

const reviewHighlights = [
  { name: "Carly Cole", quote: "Dan and his team were great!" },
  { name: "Carly Ellsworth", quote: "We moved from Indiana to Illinois." },
  { name: "Google customer", quote: "Very professional and on time!" },
];

const serviceOptions = ["Local Moving", "Long-Distance Moving", "Storage Services", "Packing & Unpacking", "Junk Removal"];

const marketingServices = [
  {
    id: "local-moving",
    title: "Local Moving",
    Icon: House,
    summary: "Moving help for Indianapolis homes, apartments, and approved Indiana destinations.",
    details: "Share both locations, property access, move size, and preferred date so the team can confirm availability and scope.",
  },
  {
    id: "long-distance-moving",
    title: "Long-Distance Moving",
    Icon: Truck,
    summary: "Route-specific moving requests that begin or end in Indiana.",
    details: "Long-distance availability is confirmed for the specific route, date, move size, and access needs. No nationwide-service claim is made.",
  },
  {
    id: "storage-services",
    title: "Storage Services",
    Icon: Warehouse,
    summary: "Ask about available storage arrangements when pickup and delivery dates do not align.",
    details: "Timing, handling, access, prohibited items, pricing, and the storage arrangement are confirmed for each request.",
  },
  {
    id: "packing-unpacking",
    title: "Packing & Unpacking",
    Icon: Package,
    summary: "Request partial or broader packing support as part of the moving plan.",
    details: "List the rooms, fragile items, timing, and material needs so the requested packing scope can be reviewed with the move.",
  },
  {
    id: "junk-removal",
    title: "Junk Removal",
    Icon: Trash,
    summary: "Household junk-removal requests in Indianapolis, reviewed item by item before scheduling.",
    details: "Share the item types, estimated volume, access, and pickup location. Hazardous, regulated, oversized, or restricted materials require review.",
    href: "/junk-removal/",
  },
];

function Brand({ homeHref = "/#home", showLogo = false }) {
  return (
    <a className={showLogo ? "brand brand--with-logo" : "brand"} href={homeHref} aria-label="Integrity Moving Service home">
      {showLogo && (
        <span className="brand-logo">
          <img src="/assets/placeholder-logo.JPEG" alt="" aria-hidden="true" width="900" height="540" decoding="async" />
        </span>
      )}
      <span className="brand-copy">
        <strong>Integrity</strong>
        <small>Moving Service</small>
      </span>
    </a>
  );
}

function PhoneLink({ className = "phone-link", location }) {
  return (
    <a
      className={className}
      href={PHONE_HREF}
      onClick={() => trackEvent("click_to_call", { link_location: location })}
    >
      <Phone size={22} weight="fill" aria-hidden="true" /> Call {PHONE_DISPLAY}
    </a>
  );
}

function QuoteForm({ defaultService = "" }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [selectedService, setSelectedService] = useState(defaultService);
  const turnstileContainer = useRef(null);
  const turnstileWidgetId = useRef(null);

  useEffect(() => {
    let cancelled = false;

    function renderTurnstile() {
      if (cancelled || !turnstileContainer.current || !window.turnstile) return;
      if (turnstileWidgetId.current !== null) return;

      turnstileWidgetId.current = window.turnstile.render(turnstileContainer.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: "light",
        callback: (token) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => {
          setTurnstileToken("");
          setError("The security check could not load. Please refresh or call us for help.");
        },
      });
    }

    if (window.turnstile) {
      renderTurnstile();
    } else {
      let script = document.getElementById("cloudflare-turnstile-script");
      if (!script) {
        script = document.createElement("script");
        script.id = "cloudflare-turnstile-script";
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      script.addEventListener("load", renderTurnstile);
    }

    return () => {
      cancelled = true;
      const script = document.getElementById("cloudflare-turnstile-script");
      script?.removeEventListener("load", renderTurnstile);
      if (turnstileWidgetId.current !== null && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = null;
      }
    };
  }, []);

  async function submitQuote(event) {
    event.preventDefault();
    setError("");

    if (!turnstileToken) {
      setError("Please complete the security check before submitting.");
      return;
    }

    setStatus("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          movingFrom: formData.get("movingFrom"),
          movingTo: formData.get("movingTo"),
          moveDate: formData.get("moveDate"),
          service: formData.get("service"),
          packingServices: formData.get("packingServices"),
          details: formData.get("details"),
          company: formData.get("company"),
          consent: formData.get("consent") === "yes",
          turnstileToken,
          attribution: getCampaignAttribution(),
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "We could not send your request.");

      trackEvent("generate_lead", { method: "website_quote", service_name: formData.get("service") });
      setStatus("success");
    } catch (submissionError) {
      setStatus("idle");
      setError(`${submissionError.message} Please try again or call ${PHONE_DISPLAY}.`);
      setTurnstileToken("");
      if (turnstileWidgetId.current !== null && window.turnstile) {
        window.turnstile.reset(turnstileWidgetId.current);
      }
    }
  }

  if (status === "success") {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <CheckCircle size={54} weight="fill" aria-hidden="true" />
        <h2>Thanks — we received your quote request.</h2>
        <p>Integrity Moving Service will use your details to follow up about your move.</p>
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
      <p className="form-intro">{selectedService === "Junk Removal" ? "Tell Us About Your Pickup" : "Tell Us About Your Move"}</p>

      <label htmlFor="customer-name">Your Name</label>
      <input id="customer-name" name="name" autoComplete="name" maxLength="100" required />

      <label htmlFor="email-address">Email Address <span>(optional)</span></label>
      <input id="email-address" name="email" type="email" autoComplete="email" maxLength="200" />

      <label htmlFor="moving-from">{selectedService === "Junk Removal" ? "Pickup Location" : "Moving From"} <span>(city or ZIP)</span></label>
      <div className="input-wrap">
        <MapPin size={21} weight="fill" aria-hidden="true" />
        <input id="moving-from" name="movingFrom" autoComplete="postal-code" maxLength="120" required />
      </div>

      <label htmlFor="service-type">Service Needed</label>
      <select id="service-type" name="service" value={selectedService} onChange={(event) => setSelectedService(event.target.value)} required>
        <option value="" disabled>Select a service</option>
        {serviceOptions.map((service) => <option value={service} key={service}>{service}</option>)}
      </select>

      {selectedService === "Junk Removal" ? (
        <>
          <input name="movingTo" type="hidden" value="Not applicable — junk removal" />
          <p className="field-note">Only the pickup location is needed for a junk-removal request.</p>
        </>
      ) : (
        <>
          <label htmlFor="moving-to">Moving To <span>(city or ZIP)</span></label>
          <div className="input-wrap">
            <MapPin size={21} weight="fill" aria-hidden="true" />
            <input id="moving-to" name="movingTo" autoComplete="postal-code" maxLength="120" required />
          </div>
        </>
      )}

      <label htmlFor="move-date">{selectedService === "Junk Removal" ? "Preferred Service Date" : "Move Date"}</label>
      <input id="move-date" name="moveDate" type="date" required />

      <label htmlFor="phone-number">Phone Number</label>
      <div className="input-wrap">
        <Phone size={21} weight="fill" aria-hidden="true" />
        <input id="phone-number" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength="30" required />
      </div>

      {selectedService === "Junk Removal" ? (
        <input name="packingServices" type="hidden" value="No" />
      ) : (
        <fieldset className="packing-choice">
          <legend>Do you need packing services?</legend>
          <label>
            <input name="packingServices" type="radio" value="Yes" required />
            <span>Yes</span>
          </label>
          <label>
            <input name="packingServices" type="radio" value="No" required />
            <span>No</span>
          </label>
        </fieldset>
      )}

      <label htmlFor="move-details">Anything Else We Should Know? <span>(optional)</span></label>
      <textarea id="move-details" name="details" rows="4" maxLength="1500" />

      <div className="quote-honeypot" aria-hidden="true">
        <label htmlFor="company-name">Company</label>
        <input id="company-name" name="company" tabIndex="-1" autoComplete="off" />
      </div>

      <div className="turnstile-wrap" ref={turnstileContainer} aria-label="Security check" />

      <label className="consent-row">
        <input name="consent" type="checkbox" value="yes" required />
        <span>I agree that Integrity Moving Service may contact me about this quote request.</span>
      </label>

      {error && <p className="form-error" role="alert">{error}</p>}

      <button className="button button--primary button--wide" type="submit" disabled={status === "submitting" || !turnstileToken}>
        {status === "submitting" ? "Sending…" : "Request My Quote"}
        <ArrowRight size={21} weight="bold" aria-hidden="true" />
      </button>
      <p className="form-note">No payment required to start your quote.</p>
    </form>
  );
}

function SiteHeader({ menuOpen, setMenuOpen, openQuote, onHomePage = false, defaultService = "" }) {
  const sectionPrefix = onHomePage ? "" : "/";
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header" id="home">
      <div className="phone-strip">
        <PhoneLink location="top_bar" />
      </div>
      <div className="nav-shell">
        <Brand homeHref={onHomePage ? "#home" : "/#home"} showLogo />
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
          <a href={`${sectionPrefix}#home`} onClick={closeMenu}>Home</a>
          <a href="/services/" onClick={closeMenu}>Services</a>
          <a href="/junk-removal/" onClick={closeMenu}>Junk Removal</a>
          <a href={`${sectionPrefix}#about`} onClick={closeMenu}>About</a>
          <a href={`${sectionPrefix}#reviews`} onClick={closeMenu}>Reviews</a>
          <a href={`${sectionPrefix}#contact`} onClick={closeMenu}>Contact</a>
        </nav>
        <button className="button button--primary nav-quote" type="button" onClick={() => openQuote("navigation", defaultService)}>Get a Free Quote</button>
      </div>
    </header>
  );
}

function SiteFooter({ homeHref = "/#home" }) {
  return (
    <footer className="footer">
      <Brand homeHref={homeHref} />
      <p>Pre-execution website. Search indexing, advertising launch, and expanded service areas require separate written approval.</p>
      <a href={homeHref}>Back to top</a>
    </footer>
  );
}

function QuoteModal({ quoteOpen, setQuoteOpen, closeQuoteButton, defaultService = "" }) {
  if (!quoteOpen) return null;

  return (
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
        <QuoteForm key={defaultService || "general"} defaultService={defaultService} />
      </section>
    </div>
  );
}

function ServiceCards({ openQuote }) {
  return (
    <div className="marketing-service-grid">
      {marketingServices.map(({ id, title, Icon, summary, details, href }) => (
        <article className="marketing-service-card" id={id} key={id}>
          <Icon size={42} weight="fill" aria-hidden="true" />
          <h3>{title}</h3>
          <p>{summary}</p>
          <p className="service-detail">{details}</p>
          <div className="service-card-actions">
            <button className="button button--primary" type="button" onClick={() => openQuote(`service_${id}`, title)}>Request a Quote</button>
            {href && <a className="text-link" href={href}>View service details <ArrowRight size={18} weight="bold" aria-hidden="true" /></a>}
          </div>
        </article>
      ))}
    </div>
  );
}

function ServicesPage({ menuOpen, setMenuOpen, quoteOpen, setQuoteOpen, openQuote, closeQuoteButton, quoteService }) {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} openQuote={openQuote} />
      <main id="main-content" className="service-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol><li><a href="/">Home</a></li><li aria-current="page">Services</li></ol>
        </nav>
        <section className="service-hero services-hero" aria-labelledby="services-page-title">
          <div className="service-hero__copy">
            <p className="eyebrow">Moving, packing, storage, and cleanout support</p>
            <h1 id="services-page-title">Moving Services in Indianapolis</h1>
            <span className="red-rule" aria-hidden="true" />
            <p>Choose the service that matches your move, then share the route, timing, access, and item details needed for an accurate conversation.</p>
            <div className="hero-actions">
              <button className="button button--primary" type="button" onClick={() => openQuote("services_hero")}>Get a Free Quote</button>
              <PhoneLink location="services_hero" />
            </div>
          </div>
        </section>
        <section className="services-catalog section" aria-labelledby="services-catalog-title">
          <div className="catalog-heading">
            <p className="eyebrow eyebrow--dark">Choose your service</p>
            <h2 id="services-catalog-title">Build the Request Around the Work</h2>
            <p>Every quote is confirmed from the specific addresses, service needs, access, inventory, and schedule. Website descriptions do not replace the written scope.</p>
          </div>
          <ServiceCards openQuote={openQuote} />
        </section>
        <section className="service-steps" aria-labelledby="services-process-title">
          <div className="section service-steps__inner">
            <p className="eyebrow eyebrow--dark">Quote-ready details</p>
            <h2 id="services-process-title">What to Include in Your Request</h2>
            <div className="service-step-grid">
              <article><span>01</span><h3>Locations</h3><p>Provide the full origin and destination plus stairs, elevators, parking, and loading access.</p></article>
              <article><span>02</span><h3>Timing</h3><p>Share the preferred move date and any building, closing, storage, or delivery timing constraints.</p></article>
              <article><span>03</span><h3>Scope</h3><p>Describe the move size, important items, packing needs, and any service-specific limitations.</p></article>
            </div>
          </div>
        </section>
        <section className="closing" id="contact" aria-labelledby="services-cta-title">
          <div className="closing-copy"><div className="closing-message"><div className="section-kicker" aria-hidden="true" /><h2 id="services-cta-title">Start With the Right Details.</h2><p>Tell Integrity what you need, where the work begins and ends, and when you want it completed.</p></div><div className="closing-actions"><button className="button button--primary" type="button" onClick={() => openQuote("services_closing")}>Request a Quote</button><PhoneLink location="services_closing" /></div></div>
        </section>
      </main>
      <SiteFooter homeHref="/#home" />
      <a className="mobile-call" href={PHONE_HREF} aria-label={`Call Integrity Moving Service at ${PHONE_DISPLAY}`} onClick={() => trackEvent("click_to_call", { link_location: "mobile_fixed_services" })}><Phone size={23} weight="fill" aria-hidden="true" /> Call Now</a>
      <QuoteModal quoteOpen={quoteOpen} setQuoteOpen={setQuoteOpen} closeQuoteButton={closeQuoteButton} defaultService={quoteService} />
    </>
  );
}

function JunkRemovalPage({ menuOpen, setMenuOpen, quoteOpen, setQuoteOpen, openQuote, closeQuoteButton, quoteService }) {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} openQuote={openQuote} defaultService="Junk Removal" />

      <main id="main-content" className="service-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li aria-current="page">Junk Removal</li>
          </ol>
        </nav>

        <section className="service-hero" aria-labelledby="junk-removal-title">
          <div className="service-hero__copy">
            <p className="eyebrow">Junk removal service</p>
            <h1 id="junk-removal-title">Junk Removal in Indianapolis</h1>
            <span className="red-rule" aria-hidden="true" />
            <p>Clear out unwanted household items with a straightforward plan and a team focused on careful, respectful service.</p>
            <div className="hero-actions">
              <button className="button button--primary" type="button" onClick={() => openQuote("junk_removal_hero", "Junk Removal")}>Request a Junk-Removal Quote</button>
              <PhoneLink location="junk_removal_hero" />
              <a className="button button--outline-light" href="#junk-removal-details">Learn What to Expect</a>
            </div>
          </div>
        </section>

        <section className="service-content section" id="junk-removal-details" aria-labelledby="junk-details-title">
          <div>
            <p className="eyebrow eyebrow--dark">A simpler cleanout</p>
            <h2 id="junk-details-title">Help With Household Junk and Unwanted Items</h2>
          </div>
          <div className="service-copy-grid">
            <p>Common requests may include unwanted furniture, boxed household items, and non-hazardous clutter. Every request is reviewed first so the item type, access, volume, and scheduling needs are clear.</p>
            <p>We do not assume that every material can be removed. Hazardous, regulated, oversized, or restricted items require separate confirmation and may not be accepted.</p>
          </div>
        </section>

        <section className="service-steps" aria-labelledby="junk-process-title">
          <div className="section service-steps__inner">
            <p className="eyebrow eyebrow--dark">What to expect</p>
            <h2 id="junk-process-title">A Clear Three-Step Process</h2>
            <div className="service-step-grid">
              <article><span>01</span><h3>Describe the Items</h3><p>Share what needs to go, where it is located, and any access details.</p></article>
              <article><span>02</span><h3>Confirm the Scope</h3><p>Integrity confirms availability, accepted items, timing, and any important limitations.</p></article>
              <article><span>03</span><h3>Schedule the Removal</h3><p>Once the details are approved, choose an available time for the requested service.</p></article>
            </div>
          </div>
        </section>

        <section className="service-faq section" aria-labelledby="junk-faq-title">
          <p className="eyebrow eyebrow--dark">Junk removal questions</p>
          <h2 id="junk-faq-title">Frequently Asked Questions</h2>
          <details><summary>What items can Integrity remove?</summary><p>Accepted items are confirmed case by case. Send a description or photos before scheduling so the team can identify any restricted or unsupported materials.</p></details>
          <details><summary>Is same-day junk removal available?</summary><p>Availability is not guaranteed. Call to confirm the current schedule and whether the requested work can be accommodated.</p></details>
          <details><summary>Do you remove hazardous materials?</summary><p>Call before making plans involving hazardous, regulated, oversized, or restricted materials. The specific item must be reviewed before scheduling.</p></details>
        </section>

        <section className="closing" id="contact" aria-labelledby="junk-cta-title">
          <div className="closing-copy">
            <div className="closing-message">
              <div className="section-kicker" aria-hidden="true" />
              <h2 id="junk-cta-title">Ask About Junk Removal</h2>
              <p>Call with a description of the items and the pickup location. Availability and service details will be confirmed before scheduling.</p>
            </div>
            <div className="closing-actions"><button className="button button--primary" type="button" onClick={() => openQuote("junk_removal_closing", "Junk Removal")}>Request a Quote</button><PhoneLink location="junk_removal_closing" /></div>
          </div>
        </section>
      </main>

      <SiteFooter homeHref="/#home" />
      <a className="mobile-call" href={PHONE_HREF} aria-label={`Call Integrity Moving Service at ${PHONE_DISPLAY}`} onClick={() => trackEvent("click_to_call", { link_location: "mobile_fixed_junk_removal" })}>
        <Phone size={23} weight="fill" aria-hidden="true" /> Call Now
      </a>
      <QuoteModal quoteOpen={quoteOpen} setQuoteOpen={setQuoteOpen} closeQuoteButton={closeQuoteButton} defaultService={quoteService || "Junk Removal"} />
    </>
  );
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteService, setQuoteService] = useState("");
  const closeQuoteButton = useRef(null);

  function openQuote(ctaLocation, service = "") {
    setQuoteService(service);
    trackEvent("quote_form_open", { cta_location: ctaLocation, service_name: service || "Not selected" });
    setQuoteOpen(true);
  }

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

  if (window.location.pathname === "/services" || window.location.pathname === "/services/") {
    return <ServicesPage menuOpen={menuOpen} setMenuOpen={setMenuOpen} quoteOpen={quoteOpen} setQuoteOpen={setQuoteOpen} openQuote={openQuote} closeQuoteButton={closeQuoteButton} quoteService={quoteService} />;
  }

  if (window.location.pathname === "/junk-removal" || window.location.pathname === "/junk-removal/") {
    return (
      <JunkRemovalPage
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        quoteOpen={quoteOpen}
        setQuoteOpen={setQuoteOpen}
        openQuote={openQuote}
        closeQuoteButton={closeQuoteButton}
        quoteService={quoteService}
      />
    );
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>

      <SiteHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} openQuote={openQuote} onHomePage />

      <main id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-photo">
            <img src="/assets/hero-moving-crew.jpg" alt="Moving crew carefully carrying wrapped furniture toward a moving truck" width="1800" height="1200" fetchPriority="high" />
            <div className="hero-copy">
              <p className="eyebrow">Indianapolis moving service</p>
            <h1 id="hero-title">Indianapolis Moving.<br />Handled With Care.</h1>
              <span className="red-rule" aria-hidden="true" />
              <p>Request local or long-distance moving, packing, storage, or junk-removal help with a plan built from the real details.</p>
              <div className="hero-actions">
                <button className="button button--primary" type="button" onClick={() => openQuote("hero")}>Get a Free Quote</button>
                <PhoneLink location="hero" />
              </div>
            </div>
          </div>
        </section>

        <div className="red-band" aria-hidden="true" />

        <section className="story section" id="about" aria-labelledby="story-title">
          <div className="story-image">
            <img src="/assets/careful-wrapping.jpg" alt="Mover carefully wrapping a chair inside a home" width="960" height="1200" loading="lazy" decoding="async" />
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

        <section className="reviews section" id="reviews" aria-labelledby="reviews-title">
          <div className="reviews-heading">
            <div>
              <div className="section-kicker" aria-hidden="true" />
              <p className="eyebrow eyebrow--dark">Customer feedback on Google</p>
              <h2 id="reviews-title">A Reputation Built One Move at a Time</h2>
            </div>
            <div className="google-rating" role="img" aria-label="Rated 4.6 out of 5 from 129 Google reviews">
              <strong>4.6</strong>
              <div className="review-stars" aria-hidden="true">
                {Array.from({ length: 5 }, (_, index) => <Star key={index} weight="fill" size={22} />)}
              </div>
              <span>129 Google reviews</span>
            </div>
          </div>
          <div className="review-grid">
            {reviewHighlights.map(({ name, quote }) => (
              <figure className="review-card" key={name}>
                <div className="review-stars" role="img" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }, (_, index) => <Star key={index} weight="fill" size={18} aria-hidden="true" />)}
                </div>
                <blockquote>“{quote}”</blockquote>
                <figcaption>{name} <span>· Google review</span></figcaption>
              </figure>
            ))}
          </div>
          <div className="reviews-footer">
            <p>Rating and excerpts verified on the Integrity Moving Service Google Business Profile on August 14, 2026.</p>
            <a
              className="button button--dark"
              href={GOOGLE_PROFILE_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("google_reviews_click", { link_location: "reviews_section" })}
            >
              Read All Reviews on Google <ArrowRight size={20} weight="bold" aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="services-catalog section" id="services" aria-labelledby="home-services-title">
          <div className="catalog-heading">
            <p className="eyebrow eyebrow--dark">Ways we can help</p>
            <h2 id="home-services-title">Moving and Related Services</h2>
            <p>Start with the service that best matches your request. Availability and final scope are confirmed from the move details.</p>
          </div>
          <ServiceCards openQuote={openQuote} />
          <a className="text-link services-all-link" href="/services/">Explore all service details <ArrowRight size={18} weight="bold" aria-hidden="true" /></a>
        </section>

        <section className="process section" id="process" aria-labelledby="process-title">
          <h2 className="visually-hidden" id="process-title">A simple moving process</h2>
          <div className="process-grid">
            {processSteps.map(({ number, title, body, image, alt, width, height }) => (
              <article className="process-step" key={number}>
                <div className="step-heading"><span>{number}</span><h3>{title}</h3></div>
                <img src={image} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
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
              <button className="button button--primary" type="button" onClick={() => openQuote("closing")}>Get a Free Quote</button>
              <PhoneLink location="closing" />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter homeHref="#home" />

      <a className="mobile-call" href={PHONE_HREF} aria-label={`Call Integrity Moving Service at ${PHONE_DISPLAY}`} onClick={() => trackEvent("click_to_call", { link_location: "mobile_fixed" })}>
        <Phone size={23} weight="fill" aria-hidden="true" /> Call Now
      </a>

      <QuoteModal quoteOpen={quoteOpen} setQuoteOpen={setQuoteOpen} closeQuoteButton={closeQuoteButton} defaultService={quoteService} />
    </>
  );
}
