import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowsLeftRight,
  Buildings,
  CalendarBlank,
  CaretDown,
  Check,
  CheckCircle,
  Clock,
  EnvelopeSimple,
  House,
  List,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Star,
  Truck,
  Warehouse,
  X,
} from "@phosphor-icons/react";
import { areas, business, pageMeta, primaryNav, services } from "./siteContent.js";
import { getAreaMeta, getServiceMeta } from "./seo.js";

const iconMap = {
  arrows: ArrowsLeftRight,
  buildings: Buildings,
  house: House,
  map: MapPin,
  package: Package,
  truck: Truck,
  warehouse: Warehouse,
};

function normalizePath(pathname) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  return clean.toLowerCase();
}

function usePageMeta(meta) {
  useEffect(() => {
    document.title = meta.title;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", meta.description);
  }, [meta]);
}

function Brand() {
  return (
    <a className="brand" href="/" aria-label={`${business.name} home`}>
      <span>Integrity</span>
      <small>Moving Service</small>
    </a>
  );
}

function Header() {
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
      <div className="staging-bar">Draft preview — services, routes, claims, and form delivery require approval before launch.</div>
      <header className="site-header">
        <div className="phone-strip">
          <span>Indianapolis & Lafayette moving requests</span>
          <a href={business.phoneHref}><Phone size={17} weight="fill" aria-hidden="true" /> Call {business.phoneDisplay}</a>
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
            {primaryNav.map(([label, href]) => (
              <a href={href} key={href} onClick={() => setMenuOpen(false)}>{label}</a>
            ))}
          </nav>
          <a className="button button--primary nav-quote" href="/contact/#quote">Get a Free Quote</a>
        </div>
      </header>
    </>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Brand />
          <p>Clear planning for local Indiana moves and approved interstate routes.</p>
          <a className="footer-contact" href={business.phoneHref}><Phone size={18} weight="fill" aria-hidden="true" /> {business.phoneDisplay}</a>
          <a className="footer-contact" href={business.emailHref}><EnvelopeSimple size={18} weight="fill" aria-hidden="true" /> Email Integrity</a>
        </div>
        <div>
          <h2>Services</h2>
          <ul>
            {services.map((service) => <li key={service.slug}><a href={`/services/${service.slug}/`}>{service.shortTitle}</a></li>)}
          </ul>
        </div>
        <div>
          <h2>Service Areas</h2>
          <ul>
            {areas.map((area) => <li key={area.slug}><a href={`/service-areas/${area.slug}/`}>{area.shortTitle}</a></li>)}
          </ul>
        </div>
        <div>
          <h2>Company</h2>
          <ul>
            <li><a href="/about/">About</a></li>
            <li><a href="/contact/">Contact & Quote</a></li>
            <li><a href="/privacy/">Privacy Notice</a></li>
            <li><a href="/site-index/">Site Index</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} {business.name}. Draft website pending written approval.</p>
        <p>Not all routes or services are available for every move. Confirm availability and scope in writing.</p>
      </div>
    </footer>
  );
}

function Layout({ children }) {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <a className="mobile-call" href={business.phoneHref} aria-label={`Call ${business.name} at ${business.phoneDisplay}`}>
        <Phone size={23} weight="fill" aria-hidden="true" /> Call Now
      </a>
    </>
  );
}

function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li><a href="/">Home</a></li>
        {items.map((item, index) => (
          <li key={item.href || item.label} aria-current={index === items.length - 1 ? "page" : undefined}>
            {item.href ? <a href={item.href}>{item.label}</a> : item.label}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function QuoteForm({ compact = false }) {
  const [status, setStatus] = useState("idle");
  const [tracking, setTracking] = useState({
    landingPage: "",
    referrer: "",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmContent: "",
    utmTerm: "",
    gclid: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTracking({
      landingPage: window.location.pathname,
      referrer: document.referrer,
      utmSource: params.get("utm_source") || "",
      utmMedium: params.get("utm_medium") || "",
      utmCampaign: params.get("utm_campaign") || "",
      utmContent: params.get("utm_content") || "",
      utmTerm: params.get("utm_term") || "",
      gclid: params.get("gclid") || "",
    });
  }, []);

  function submitQuote(event) {
    event.preventDefault();
    setStatus("preview");
  }

  if (status === "preview") {
    return (
      <div className={`form-success${compact ? " form-success--compact" : ""}`} role="status" aria-live="polite">
        <CheckCircle size={54} weight="fill" aria-hidden="true" />
        <h2>Form preview complete.</h2>
        <p>This staging form is intentionally not sending customer data yet. Call Integrity to discuss a quote while the secure lead destination is being approved.</p>
        <a className="button button--dark" href={business.phoneHref}><Phone size={21} weight="fill" aria-hidden="true" /> Call {business.phoneDisplay}</a>
        <button className="text-button" type="button" onClick={() => setStatus("idle")}>Return to the form</button>
      </div>
    );
  }

  return (
    <form
      className={`quote-form${compact ? " quote-form--compact" : ""}`}
      id="quote"
      onSubmit={submitQuote}
      data-integration="google-sheets-crm-pending"
      data-form-version="integrity-quote-v1"
    >
      <input type="hidden" name="landingPage" defaultValue={tracking.landingPage} />
      <input type="hidden" name="referrer" defaultValue={tracking.referrer} />
      <input type="hidden" name="utmSource" defaultValue={tracking.utmSource} />
      <input type="hidden" name="utmMedium" defaultValue={tracking.utmMedium} />
      <input type="hidden" name="utmCampaign" defaultValue={tracking.utmCampaign} />
      <input type="hidden" name="utmContent" defaultValue={tracking.utmContent} />
      <input type="hidden" name="utmTerm" defaultValue={tracking.utmTerm} />
      <input type="hidden" name="gclid" defaultValue={tracking.gclid} />
      <div className="section-kicker" aria-hidden="true" />
      <p className="eyebrow eyebrow--dark">Start with the details</p>
      <h2>Request a Moving Quote</h2>
      <p className="form-intro">Tell us where, when, and what you are moving.</p>

      <div className="form-grid">
        <div className="field">
          <label htmlFor={`name-${compact}`}>Name</label>
          <input id={`name-${compact}`} name="name" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor={`phone-${compact}`}>Phone</label>
          <input id={`phone-${compact}`} name="phone" type="tel" inputMode="tel" autoComplete="tel" required />
        </div>
        <div className="field">
          <label htmlFor={`email-${compact}`}>Email</label>
          <input id={`email-${compact}`} name="email" type="email" autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor={`date-${compact}`}>Preferred Move Date</label>
          <input id={`date-${compact}`} name="moveDate" type="date" required />
        </div>
        <div className="field">
          <label htmlFor={`from-${compact}`}>Moving From</label>
          <div className="input-wrap"><MapPin size={20} weight="fill" aria-hidden="true" /><input id={`from-${compact}`} name="movingFrom" autoComplete="street-address" required /></div>
        </div>
        <div className="field">
          <label htmlFor={`to-${compact}`}>Moving To</label>
          <div className="input-wrap"><MapPin size={20} weight="fill" aria-hidden="true" /><input id={`to-${compact}`} name="movingTo" autoComplete="street-address" required /></div>
        </div>
        <div className="field">
          <label htmlFor={`move-size-${compact}`}>Approximate Move Size</label>
          <select id={`move-size-${compact}`} name="moveSize" required defaultValue="">
            <option value="" disabled>Select one</option>
            <option>Studio or one bedroom</option>
            <option>Two bedrooms</option>
            <option>Three bedrooms</option>
            <option>Four or more bedrooms</option>
            <option>Other / not sure</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor={`service-${compact}`}>Service Needed</label>
          <select id={`service-${compact}`} name="service" required defaultValue="">
            <option value="" disabled>Select one</option>
            {services.map((service) => <option key={service.slug}>{service.title}</option>)}
            <option>Not sure yet</option>
          </select>
        </div>
        <div className="field field--wide">
          <label htmlFor={`details-${compact}`}>Move Details</label>
          <textarea id={`details-${compact}`} name="details" rows="4" placeholder="Stairs, elevators, large items, timing, packing, storage, or anything else we should know." />
        </div>
      </div>

      <label className="consent" htmlFor={`consent-${compact}`}>
        <input id={`consent-${compact}`} name="contactConsent" type="checkbox" required />
        <span>I agree that Integrity Moving Service may contact me about this quote request. Message or data rates may apply.</span>
      </label>
      <button className="button button--primary button--wide" type="submit">Request My Quote <ArrowRight size={21} weight="bold" aria-hidden="true" /></button>
      <p className="form-note">Staging only: secure form delivery, spam protection, CRM storage, analytics, and the final privacy language must be connected before launch.</p>
    </form>
  );
}

function CtaBand({ title = "Ready to plan your move?", body = "Share both locations, your preferred date, and the services you may need." }) {
  return (
    <section className="cta-band" aria-labelledby="cta-band-title">
      <div>
        <p className="eyebrow">Start the conversation</p>
        <h2 id="cta-band-title">{title}</h2>
        <p>{body}</p>
      </div>
      <div className="cta-band__actions">
        <a className="button button--primary" href="/contact/#quote">Request a Quote</a>
        <a className="phone-link" href={business.phoneHref}><Phone size={21} weight="fill" aria-hidden="true" /> {business.phoneDisplay}</a>
      </div>
    </section>
  );
}

function ServiceCard({ service }) {
  const Icon = iconMap[service.icon];
  return (
    <article className="card">
      <Icon size={42} weight="fill" aria-hidden="true" />
      <h3>{service.title}</h3>
      <p>{service.summary}</p>
      <a className="card-link" href={`/services/${service.slug}/`}>Explore service <ArrowRight size={18} weight="bold" aria-hidden="true" /></a>
    </article>
  );
}

function AreaCard({ area }) {
  return (
    <article className="area-card">
      <MapPin size={32} weight="fill" aria-hidden="true" />
      <div>
        <h3>{area.title}</h3>
        <p>{area.summary}</p>
        <a className="card-link" href={`/service-areas/${area.slug}/`}>View area details <ArrowRight size={18} weight="bold" aria-hidden="true" /></a>
      </div>
    </article>
  );
}

function ReviewsSection() {
  return (
    <section className="reviews-section" aria-labelledby="reviews-title">
      <div className="section">
        <div className="reviews-heading">
          <div>
            <p className="eyebrow eyebrow--dark">Feedback from Google</p>
            <h2 id="reviews-title">Customer Reviews</h2>
          </div>
          <p>Real Google reviews will appear here after the client-owned Business Profile and approved widget are connected.</p>
        </div>
        <div
          className="reviews-widget-slot"
          id="google-reviews-widget"
          data-integration="google-business-profile-reviews-pending"
          aria-label="Reserved space for the Google Reviews widget"
        >
          <div className="reviews-placeholder">
            <div className="reviews-stars" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((star) => <Star size={24} weight="fill" key={star} />)}
            </div>
            <h3>Google Reviews Widget Placement</h3>
            <p>Replace this staging card with the approved widget embed. Do not hard-code review text, names, ratings, or totals.</p>
            <span>Minimum reserved height: 320px</span>
          </div>
        </div>
        <p className="reviews-note">Reviews remain the property and opinions of their original authors. Display only authentic reviews obtained through the approved integration.</p>
      </div>
    </section>
  );
}

function HomePage() {
  usePageMeta(pageMeta.home);
  return (
    <Layout seo={{ meta: pageMeta.home, pageType: "home" }}>
      <section className="hero" aria-labelledby="home-title">
        <div className="hero-photo">
          <img src="/assets/hero-moving-crew.jpg" alt="Moving crew carrying wrapped furniture toward a moving truck" />
          <div className="hero-copy">
            <p className="eyebrow">Indianapolis & Lafayette moving requests</p>
            <h1 id="home-title">A Clearer Plan<br />For Your Move.</h1>
            <span className="red-rule" aria-hidden="true" />
            <p>Local Indiana moves and approved interstate routes, planned around your addresses, timing, access, and move details.</p>
            <div className="hero-actions">
              <a className="button button--primary" href="/contact/#quote">Get a Free Quote</a>
              <a className="phone-link" href={business.phoneHref}><Phone size={22} weight="fill" aria-hidden="true" /> Call {business.phoneDisplay}</a>
            </div>
          </div>
        </div>
        <QuoteForm compact />
      </section>

      <section className="trust-strip" aria-label="Service summary">
        <div><MapPin size={24} weight="fill" aria-hidden="true" /><span><strong>Local focus</strong>Indianapolis & Lafayette</span></div>
        <div><Truck size={24} weight="fill" aria-hidden="true" /><span><strong>Interstate requests</strong>Approved routes only</span></div>
        <div><Warehouse size={24} weight="fill" aria-hidden="true" /><span><strong>Storage options</strong>Ask about availability</span></div>
      </section>

      <section className="intro section section--split" aria-labelledby="intro-title">
        <div>
          <p className="eyebrow eyebrow--dark">Moving without the guesswork</p>
          <h2 id="intro-title">Start With Better Information</h2>
        </div>
        <div>
          <p className="lead">A moving quote is more useful when it reflects the real job—not just the distance between two ZIP codes.</p>
          <p>Share property access, approximate move size, preferred timing, packing needs, and any storage gap. Integrity can use that information to confirm whether the route and requested services are available.</p>
          <a className="text-link" href="/about/">How the planning process works <ArrowRight size={18} weight="bold" aria-hidden="true" /></a>
        </div>
      </section>

      <section className="services-section section" aria-labelledby="services-title">
        <div className="section-heading section-heading--left">
          <div><p className="eyebrow eyebrow--dark">Ways we can help</p><h2 id="services-title">Moving Services</h2></div>
          <a className="text-link" href="/services/">View all services <ArrowRight size={18} weight="bold" aria-hidden="true" /></a>
        </div>
        <div className="card-grid">{services.map((service) => <ServiceCard service={service} key={service.slug} />)}</div>
      </section>

      <section className="process-section" aria-labelledby="process-title">
        <div className="section">
          <div className="section-heading"><p className="eyebrow">What to expect</p><h2 id="process-title">Three Clear Steps</h2></div>
          <div className="process-grid">
            {[
              ["01", CalendarBlank, "Share the move", "Tell us the origin, destination, date, move size, access, and services you may need."],
              ["02", Phone, "Confirm the plan", "Discuss availability, scope, timing, and the details that belong in the written quote."],
              ["03", Truck, "Prepare for moving day", "Keep contacts, access instructions, and arrival details clear before the scheduled move."],
            ].map(([number, Icon, title, body]) => (
              <article className="process-step" key={number}>
                <div className="step-top"><span>{number}</span><Icon size={44} weight="fill" aria-hidden="true" /></div>
                <h3>{title}</h3><span className="mini-rule" aria-hidden="true" /><p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="areas-section section" aria-labelledby="areas-title">
        <div className="section-heading section-heading--left">
          <div><p className="eyebrow eyebrow--dark">Local first, interstate when approved</p><h2 id="areas-title">Service Areas</h2></div>
          <a className="text-link" href="/service-areas/">Explore all areas <ArrowRight size={18} weight="bold" aria-hidden="true" /></a>
        </div>
        <div className="area-grid">{areas.map((area) => <AreaCard area={area} key={area.slug} />)}</div>
      </section>

      <ReviewsSection />

      <CtaBand />
    </Layout>
  );
}

function ListingHero({ eyebrow, title, body, breadcrumbs }) {
  return (
    <section className="page-hero">
      <div className="section">
        <Breadcrumbs items={breadcrumbs} />
        <div className="page-hero__copy"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{body}</p></div>
      </div>
    </section>
  );
}

function ServicesPage() {
  usePageMeta(pageMeta.services);
  return (
    <Layout seo={{ meta: pageMeta.services, pageType: "services", breadcrumbs: [["Services", "/services/"]] }}>
      <ListingHero eyebrow="Plan the right level of help" title="Moving Services" body="Explore the proposed service menu, then request one quote that reflects your route, move size, timing, access, packing, loading, and storage needs." breadcrumbs={[{ label: "Services" }]} />
      <section className="section listing-intro section--split">
        <div><p className="eyebrow eyebrow--dark">One move, one clear request</p><h2>Build the Scope Around Your Situation</h2></div>
        <div><p className="lead">Services can work together, but availability and what is included must be confirmed in the written quote.</p><p>Use these pages to understand what information matters. The quote process—not a generic website package—should define the final scope.</p></div>
      </section>
      <section className="section listing-grid" aria-label="All moving services">{services.map((service) => <ServiceCard service={service} key={service.slug} />)}</section>
      <CtaBand title="Not sure which service fits?" body="Describe the move and the help you expect to need. Integrity can use those details to discuss the right scope." />
    </Layout>
  );
}

function ServiceDetailPage({ service }) {
  const Icon = iconMap[service.icon];
  const meta = getServiceMeta(service);
  const schemaBreadcrumbs = [["Services", "/services/"], [service.title, `/services/${service.slug}/`]];
  usePageMeta(meta);
  return (
    <Layout seo={{ meta, pageType: "service", service, breadcrumbs: schemaBreadcrumbs }}>
      <section className="detail-hero">
        <div className="section">
          <Breadcrumbs items={[{ label: "Services", href: "/services/" }, { label: service.title }]} />
          <div className="detail-hero__grid">
            <div><p className="eyebrow">{service.eyebrow}</p><h1>{service.title}</h1><p>{service.intro}</p><div className="hero-actions"><a className="button button--primary" href="/contact/#quote">Request a Quote</a><a className="phone-link" href={business.phoneHref}><Phone size={21} weight="fill" /> {business.phoneDisplay}</a></div></div>
            <div className="detail-icon" aria-hidden="true"><Icon size={104} weight="fill" /></div>
          </div>
        </div>
      </section>
      <section className="section detail-content">
        <div className="detail-main">
          {service.sections.map((section) => <div className="content-block" key={section.title}><p className="eyebrow eyebrow--dark">What to know</p><h2>{section.title}</h2><p>{section.body}</p></div>)}
          <div className="content-block"><p className="eyebrow eyebrow--dark">Common questions</p><h2>{service.title} FAQ</h2><div className="faq-list">{service.faqs.map(([question, answer]) => <details key={question}><summary>{question}<CaretDown size={20} weight="bold" /></summary><p>{answer}</p></details>)}</div></div>
        </div>
        <aside className="detail-aside">
          <h2>Include these details</h2>
          <ul>{service.highlights.map((item) => <li key={item}><Check size={19} weight="bold" aria-hidden="true" />{item}</li>)}</ul>
          <a className="button button--primary button--wide" href="/contact/#quote">Start My Quote</a>
          <p>Availability and final scope require confirmation.</p>
        </aside>
      </section>
      <CtaBand />
    </Layout>
  );
}

function AreasPage() {
  usePageMeta(pageMeta.areas);
  return (
    <Layout seo={{ meta: pageMeta.areas, pageType: "areas", breadcrumbs: [["Service Areas", "/service-areas/"]] }}>
      <ListingHero eyebrow="Indiana-based moving requests" title="Service Areas" body="Integrity’s proposed footprint is local-first: Indianapolis and Lafayette, other approved Indiana moves, and select interstate routes connected to Indiana." breadcrumbs={[{ label: "Service Areas" }]} />
      <section className="section listing-intro section--split">
        <div><p className="eyebrow eyebrow--dark">Route-specific service</p><h2>No Blanket Coverage Claims</h2></div>
        <div><p className="lead">An area page is an invitation to request availability—not a promise that every city, date, route, or move size can be accepted.</p><p>Final publication requires written approval of the service areas below. Each quote should confirm the exact origin and destination.</p></div>
      </section>
      <section className="section area-grid area-grid--listing" aria-label="Proposed moving service areas">{areas.map((area) => <AreaCard area={area} key={area.slug} />)}</section>
      <CtaBand title="Is your route a fit?" body="Share both locations and your preferred date. Integrity can confirm whether the requested route is available." />
    </Layout>
  );
}

function AreaDetailPage({ area }) {
  const meta = getAreaMeta(area);
  const schemaBreadcrumbs = [["Service Areas", "/service-areas/"], [area.shortTitle, `/service-areas/${area.slug}/`]];
  usePageMeta(meta);
  return (
    <Layout seo={{ meta, pageType: "area", area, breadcrumbs: schemaBreadcrumbs }}>
      <section className="detail-hero detail-hero--area">
        <div className="section">
          <Breadcrumbs items={[{ label: "Service Areas", href: "/service-areas/" }, { label: area.shortTitle }]} />
          <div className="detail-hero__grid">
            <div><p className="eyebrow">{area.eyebrow}</p><h1>{area.title}</h1><p>{area.intro}</p><div className="hero-actions"><a className="button button--primary" href="/contact/#quote">Check My Route</a><a className="phone-link" href={business.phoneHref}><Phone size={21} weight="fill" /> {business.phoneDisplay}</a></div></div>
            <div className="route-mark" aria-hidden="true"><MapPin size={74} weight="fill" /><span>{area.shortTitle}</span></div>
          </div>
        </div>
      </section>
      <section className="section detail-content">
        <div className="detail-main">
          <div className="content-block"><p className="eyebrow eyebrow--dark">Area availability</p><h2>Confirm the Complete Route</h2><p>{area.focus}</p><p>Availability depends on the specific addresses, date, move size, requested services, and operational capacity. The approved written quote controls the final scope.</p></div>
          <div className="content-block"><p className="eyebrow eyebrow--dark">Services to discuss</p><h2>Build One Move Plan</h2><div className="inline-links">{services.map((service) => <a href={`/services/${service.slug}/`} key={service.slug}>{service.shortTitle}<ArrowRight size={16} weight="bold" /></a>)}</div></div>
        </div>
        <aside className="detail-aside">
          <h2>What helps us evaluate the route</h2>
          <ul>{area.planning.map((item) => <li key={item}><Check size={19} weight="bold" aria-hidden="true" />{item}</li>)}</ul>
          <a className="button button--primary button--wide" href="/contact/#quote">Check Availability</a>
          <p>This proposed area requires written approval before publication.</p>
        </aside>
      </section>
      <CtaBand title={`Planning a move involving ${area.shortTitle}?`} body="Send the exact origin, destination, timing, and move details so availability can be evaluated." />
    </Layout>
  );
}

function AboutPage() {
  usePageMeta(pageMeta.about);
  return (
    <Layout seo={{ meta: pageMeta.about, pageType: "about", breadcrumbs: [["About", "/about/"]] }}>
      <ListingHero eyebrow="A straightforward moving experience" title="About Integrity" body="The website is being built around a simple idea: customers should understand the next step, what information matters, and how to request an accurate conversation about their move." breadcrumbs={[{ label: "About" }]} />
      <section className="story section" aria-labelledby="about-story-title">
        <div className="story-image"><img src="/assets/careful-wrapping.jpg" alt="Mover wrapping a chair inside a home" /></div>
        <div className="story-copy"><p className="eyebrow eyebrow--dark">Customer-first planning</p><h2 id="about-story-title">Listen First. Plan From the Details.</h2><p className="lead">A move can become complicated quickly when the addresses, access, timing, inventory, or expectations are unclear.</p><p>The draft Integrity experience asks for those details early. It keeps local service at the center, makes interstate routes specific, and gives every page a direct way to call or request a quote.</p><p>Company history, team biographies, licenses, insurance statements, affiliations, awards, guarantees, and customer testimonials will only be added after the client provides approved evidence.</p></div>
      </section>
      <section className="values-section">
        <div className="section">
          <div className="section-heading"><p className="eyebrow">The standard for this website</p><h2>Useful Over Flashy</h2></div>
          <div className="values-grid">
            <article><ShieldCheck size={42} weight="fill" /><h3>Accurate claims</h3><p>No invented guarantees, rankings, service areas, or credentials.</p></article>
            <article><Clock size={42} weight="fill" /><h3>Clear timing</h3><p>Dates and routes are requests until the move is accepted and confirmed.</p></article>
            <article><EnvelopeSimple size={42} weight="fill" /><h3>Direct follow-up</h3><p>Every lead should have a clear owner, notification, status, and next action.</p></article>
          </div>
        </div>
      </section>
      <CtaBand />
    </Layout>
  );
}

function ContactPage() {
  usePageMeta(pageMeta.contact);
  return (
    <Layout seo={{ meta: pageMeta.contact, pageType: "contact", breadcrumbs: [["Contact & Quote", "/contact/"]] }}>
      <ListingHero eyebrow="Request availability" title="Tell Us About Your Move" body="The fastest way to start is with both locations, a preferred date, the size of the move, and any access, packing, or storage details." breadcrumbs={[{ label: "Contact & Quote" }]} />
      <section className="contact-section section">
        <div className="contact-copy">
          <p className="eyebrow eyebrow--dark">Talk with Integrity</p>
          <h2>Call or Send the Details</h2>
          <p className="lead">The form is still in staging. Until its secure destination is approved and tested, call or email rather than relying on an online submission.</p>
          <a className="contact-method" href={business.phoneHref}><Phone size={28} weight="fill" /><span><small>Call</small>{business.phoneDisplay}</span></a>
          <a className="contact-method" href={business.emailHref}><EnvelopeSimple size={28} weight="fill" /><span><small>Email</small>{business.email}</span></a>
          <div className="approval-box"><ShieldCheck size={28} weight="fill" /><p><strong>Before launch:</strong> connect spam protection, secure storage, Gmail alerts, CRM/Sheet logging, lead-source fields, consent text, and a tested success event.</p></div>
        </div>
        <QuoteForm />
      </section>
    </Layout>
  );
}

function PrivacyPage() {
  usePageMeta(pageMeta.privacy);
  return (
    <Layout seo={{ meta: pageMeta.privacy, pageType: "privacy", breadcrumbs: [["Privacy Notice", "/privacy/"]] }}>
      <ListingHero eyebrow="Draft for review" title="Privacy Notice" body="This working notice describes the planned website data flow. It requires client and appropriate legal review before publication." breadcrumbs={[{ label: "Privacy Notice" }]} />
      <article className="legal section">
        <p className="approval-box"><strong>Draft only.</strong> This is operational website copy, not legal advice. Collection tools, vendors, retention, and customer rights must be confirmed before launch.</p>
        <h2>Information customers may provide</h2><p>The quote form is expected to collect contact information, origin and destination details, preferred dates, move size, requested services, and additional information a customer chooses to provide.</p>
        <h2>How the information may be used</h2><p>Integrity Moving Service may use submitted information to respond to quote requests, assess route and service availability, communicate about a requested move, maintain lead records, and improve website performance.</p>
        <h2>Service providers</h2><p>Approved vendors may process information to host the website, protect forms from spam, deliver notifications, store lead records, provide analytics, or support customer communications. The final notice should identify practices accurately after the toolset is selected.</p>
        <h2>Retention and security</h2><p>Lead information should be retained only as long as reasonably needed for the approved business purpose and protected using appropriate account access, permissions, and security controls. Final retention periods remain to be defined.</p>
        <h2>Questions</h2><p>Questions about website information can be sent to <a href={business.emailHref}>{business.email}</a>.</p>
      </article>
    </Layout>
  );
}

function SiteIndexPage() {
  usePageMeta(pageMeta.index);
  const pageLinks = [
    ["Home", "/", "Overview, moving services, service areas, reviews, and quote form."],
    ["Moving Services", "/services/", "Browse every proposed moving and storage service."],
    ["Service Areas", "/service-areas/", "Browse local Indiana markets and proposed interstate routes."],
    ["About Integrity", "/about/", "Learn about the customer-first planning approach."],
    ["Contact & Quote", "/contact/", "Call, email, or prepare a moving quote request."],
    ["Privacy Notice", "/privacy/", "Review the staged website data-handling notice."],
  ];

  return (
    <Layout seo={{ meta: pageMeta.index, pageType: "index", breadcrumbs: [["Site Index", "/site-index/"]] }}>
      <ListingHero
        eyebrow="Every public website page"
        title="Site Index"
        body="Use this directory to reach every service, service-area, company, and quote page in the staged Integrity Moving Service website."
        breadcrumbs={[{ label: "Site Index" }]}
      />
      <section className="site-index section" aria-label="Complete website index">
        <div className="index-group">
          <p className="eyebrow eyebrow--dark">Main pages</p>
          <h2>Website</h2>
          <div className="index-links">
            {pageLinks.map(([label, href, description]) => (
              <a href={href} key={href}><span><strong>{label}</strong><small>{description}</small></span><ArrowRight size={20} weight="bold" aria-hidden="true" /></a>
            ))}
          </div>
        </div>
        <div className="index-group">
          <p className="eyebrow eyebrow--dark">Ways we can help</p>
          <h2>Services</h2>
          <div className="index-links">
            {services.map((service) => (
              <a href={`/services/${service.slug}/`} key={service.slug}><span><strong>{service.title}</strong><small>{service.summary}</small></span><ArrowRight size={20} weight="bold" aria-hidden="true" /></a>
            ))}
          </div>
        </div>
        <div className="index-group">
          <p className="eyebrow eyebrow--dark">Where routes begin or end</p>
          <h2>Service Areas</h2>
          <div className="index-links">
            {areas.map((area) => (
              <a href={`/service-areas/${area.slug}/`} key={area.slug}><span><strong>{area.title}</strong><small>{area.summary}</small></span><ArrowRight size={20} weight="bold" aria-hidden="true" /></a>
            ))}
          </div>
        </div>
      </section>
      <CtaBand title="Need help choosing a page?" body="Start with the quote page and share both locations, the preferred date, move size, and the services you may need." />
    </Layout>
  );
}

function NotFoundPage() {
  usePageMeta({ title: "Page Not Found | Integrity Moving Service", description: "The requested page could not be found." });
  return (
    <Layout><section className="not-found section"><p className="eyebrow eyebrow--dark">404</p><h1>That Page Moved.</h1><p>Return to the homepage, explore moving services, or request a quote.</p><div className="hero-actions"><a className="button button--primary" href="/">Go Home</a><a className="text-link" href="/contact/">Contact Integrity <ArrowRight size={18} weight="bold" /></a></div></section></Layout>
  );
}

function resolvePage(pathname) {
  const path = normalizePath(pathname);
  if (path === "/") return <HomePage />;
  if (path === "/services") return <ServicesPage />;
  if (path === "/service-areas") return <AreasPage />;
  if (path === "/about") return <AboutPage />;
  if (path === "/contact") return <ContactPage />;
  if (path === "/privacy") return <PrivacyPage />;
  if (path === "/site-index") return <SiteIndexPage />;

  const serviceMatch = path.match(/^\/services\/([^/]+)$/);
  if (serviceMatch) {
    const service = services.find((item) => item.slug === serviceMatch[1]);
    if (service) return <ServiceDetailPage service={service} />;
  }

  const areaMatch = path.match(/^\/service-areas\/([^/]+)$/);
  if (areaMatch) {
    const area = areas.find((item) => item.slug === areaMatch[1]);
    if (area) return <AreaDetailPage area={area} />;
  }

  return <NotFoundPage />;
}

export function App({ initialPath }) {
  const pathname = initialPath || (typeof window === "undefined" ? "/" : window.location.pathname);
  const page = useMemo(() => resolvePage(pathname), [pathname]);

  useEffect(() => {
    if (window.location.hash) {
      window.requestAnimationFrame(() => document.querySelector(window.location.hash)?.scrollIntoView());
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return page;
}
