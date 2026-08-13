import { areas, business, pageMeta, services } from "./siteContent.js";

const serviceSeo = {
  "local-moving": {
    title: "Local Movers in Indianapolis & Lafayette | Integrity",
    description: "Request local moving help for homes and apartments in Indianapolis, Lafayette, and approved Indiana communities. Ask about packing, loading, and storage.",
  },
  "interstate-moving": {
    title: "Interstate Movers From Indiana | Integrity Moving",
    description: "Plan an approved interstate move connecting Indiana with Illinois, Ohio, Michigan, North Carolina, or another confirmed route. Request availability and a quote.",
  },
  "residential-moving": {
    title: "Residential Movers in Central Indiana | Integrity",
    description: "Request residential moving help for houses, townhomes, and condos in Indianapolis, Lafayette, and approved routes from Integrity Moving Service.",
  },
  "apartment-moving": {
    title: "Apartment Movers in Indianapolis & Lafayette | Integrity",
    description: "Plan an apartment move around stairs, elevators, parking, building rules, and timing in Indianapolis, Lafayette, or another approved service area.",
  },
  "packing-services": {
    title: "Packing Services in Central Indiana | Integrity Moving",
    description: "Ask about partial or broader packing support for a local or approved interstate move. Share rooms, fragile items, timing, and material needs.",
  },
  "loading-unloading": {
    title: "Loading & Unloading Help in Indiana | Integrity",
    description: "Request labor-focused loading or unloading help for a rental truck, container, local arrival, or departure, subject to route and schedule availability.",
  },
  storage: {
    title: "Moving & Storage Options in Indiana | Integrity",
    description: "Ask about moving and storage options when pickup and delivery dates do not align. Availability, handling, access, and terms require confirmation.",
  },
};

const areaSeo = {
  indiana: {
    title: "Indiana Movers | Local & Interstate Moving | Integrity",
    description: "Request local, in-state, or approved interstate moving help centered on Indianapolis, Lafayette, and other confirmed Indiana communities.",
  },
  indianapolis: {
    title: "Indianapolis Movers | Integrity Moving Service",
    description: "Request residential, apartment, packing, loading, storage, or approved interstate moving help in Indianapolis and confirmed surrounding communities.",
  },
  lafayette: {
    title: "Lafayette & West Lafayette Movers | Integrity",
    description: "Request moving help in Lafayette, West Lafayette, and approved nearby communities. Share access, timing, destination, packing, and storage needs.",
  },
  illinois: {
    title: "Indiana to Illinois Movers | Integrity Moving Service",
    description: "Request an approved move between Indiana and Chicago, Chicagoland, or another confirmed Illinois destination. Route and schedule availability apply.",
  },
  ohio: {
    title: "Indiana to Ohio Movers | Integrity Moving Service",
    description: "Request an approved interstate move between Indiana and Ohio. Share both addresses, move size, preferred dates, packing, and storage needs.",
  },
  michigan: {
    title: "Indiana to Michigan Movers | Integrity Moving",
    description: "Request an approved interstate move between Indiana and Michigan. Exact route, dates, move size, access, and requested services determine availability.",
  },
  "north-carolina": {
    title: "Indiana to North Carolina Movers | Integrity",
    description: "Request select moving service between Indiana and North Carolina. Complete addresses, flexible dates, move size, packing, and storage details are required.",
  },
};

export function getServiceMeta(service) {
  return serviceSeo[service.slug] || {
    title: `${service.title} | Integrity Moving Service`,
    description: service.summary,
  };
}

export function getAreaMeta(area) {
  return areaSeo[area.slug] || {
    title: `${area.title} | Integrity Moving Service`,
    description: area.summary,
  };
}

export const seoPages = [
  { route: "", path: "/", meta: pageMeta.home, pageType: "home", breadcrumbs: [] },
  { route: "services", path: "/services/", meta: pageMeta.services, pageType: "services", breadcrumbs: [["Services", "/services/"]] },
  { route: "service-areas", path: "/service-areas/", meta: pageMeta.areas, pageType: "areas", breadcrumbs: [["Service Areas", "/service-areas/"]] },
  { route: "about", path: "/about/", meta: pageMeta.about, pageType: "about", breadcrumbs: [["About", "/about/"]] },
  { route: "contact", path: "/contact/", meta: pageMeta.contact, pageType: "contact", breadcrumbs: [["Contact & Quote", "/contact/"]] },
  { route: "privacy", path: "/privacy/", meta: pageMeta.privacy, pageType: "privacy", breadcrumbs: [["Privacy Notice", "/privacy/"]] },
  { route: "site-index", path: "/site-index/", meta: pageMeta.index, pageType: "index", breadcrumbs: [["Site Index", "/site-index/"]] },
  ...services.map((service) => ({
    route: `services/${service.slug}`,
    path: `/services/${service.slug}/`,
    meta: getServiceMeta(service),
    pageType: "service",
    service,
    breadcrumbs: [["Services", "/services/"], [service.title, `/services/${service.slug}/`]],
  })),
  ...areas.map((area) => ({
    route: `service-areas/${area.slug}`,
    path: `/service-areas/${area.slug}/`,
    meta: getAreaMeta(area),
    pageType: "area",
    area,
    breadcrumbs: [["Service Areas", "/service-areas/"], [area.shortTitle, `/service-areas/${area.slug}/`]],
  })),
];

function normalizedBase(siteUrl) {
  return `${siteUrl.replace(/\/+$/, "")}/`;
}

function absoluteUrl(siteUrl, pathname) {
  return new URL(pathname.replace(/^\//, ""), normalizedBase(siteUrl)).href;
}

function areaServed(area) {
  if (area.slug === "indianapolis") return { "@type": "City", name: "Indianapolis" };
  if (area.slug === "lafayette") {
    return [
      { "@type": "City", name: "Lafayette" },
      { "@type": "City", name: "West Lafayette" },
    ];
  }

  const stateNames = {
    indiana: "Indiana",
    illinois: "Illinois",
    ohio: "Ohio",
    michigan: "Michigan",
    "north-carolina": "North Carolina",
  };
  return { "@type": "State", name: stateNames[area.slug] || area.shortTitle };
}

export function buildStructuredData({ siteUrl, path, meta, breadcrumbs = [], pageType, service, area }) {
  const rootUrl = normalizedBase(siteUrl);
  const pageUrl = absoluteUrl(rootUrl, path);
  const organizationId = `${rootUrl}#organization`;
  const websiteId = `${rootUrl}#website`;
  const webpageId = `${pageUrl}#webpage`;
  const graph = [
    {
      "@type": "Organization",
      "@id": organizationId,
      additionalType: "https://schema.org/MovingCompany",
      name: business.name,
      url: rootUrl,
      telephone: "+13174596279",
      email: business.email,
      image: absoluteUrl(rootUrl, "/assets/hero-moving-crew.jpg"),
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: rootUrl,
      name: business.name,
      publisher: { "@id": organizationId },
      inLanguage: "en-US",
    },
    {
      "@type": "WebPage",
      "@id": webpageId,
      url: pageUrl,
      name: meta.title,
      description: meta.description,
      isPartOf: { "@id": websiteId },
      about: { "@id": organizationId },
      inLanguage: "en-US",
    },
  ];

  if (breadcrumbs.length) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: rootUrl },
        ...breadcrumbs.map(([name, item], index) => ({
          "@type": "ListItem",
          position: index + 2,
          name,
          ...(index === breadcrumbs.length - 1 ? {} : { item: absoluteUrl(rootUrl, item) }),
        })),
      ],
    });
  }

  if (pageType === "service" && service) {
    graph.push({
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: service.title,
      serviceType: service.title,
      description: meta.description,
      url: pageUrl,
      provider: { "@id": organizationId },
      mainEntityOfPage: { "@id": webpageId },
    });
  }

  if (pageType === "area" && area) {
    graph.push({
      "@type": "Service",
      "@id": `${pageUrl}#service-area`,
      name: area.title,
      serviceType: "Moving services",
      description: meta.description,
      url: pageUrl,
      provider: { "@id": organizationId },
      areaServed: areaServed(area),
      mainEntityOfPage: { "@id": webpageId },
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
