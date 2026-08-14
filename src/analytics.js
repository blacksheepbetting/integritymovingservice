const MEASUREMENT_ID = "G-F69TY2D1E6";
const PRODUCTION_HOSTS = new Set(["chooseintegritymoving.com", "www.chooseintegritymoving.com"]);

if (
  typeof window !== "undefined"
  && PRODUCTION_HOSTS.has(window.location.hostname)
  && !window.__integrityAnalyticsLoaded
) {
  window.__integrityAnalyticsLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted",
  });
  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    send_page_view: true,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function trackEvent(name, parameters = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, parameters);
  }
}
