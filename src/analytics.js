const MEASUREMENT_ID = "G-F69TY2D1E6";
const PRODUCTION_HOSTS = new Set(["chooseintegritymoving.com", "www.chooseintegritymoving.com"]);
const ATTRIBUTION_STORAGE_KEY = "ims_campaign_attribution";
const CAMPAIGN_PARAMETERS = ["gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

function cleanAttributionValue(value) {
  return typeof value === "string" ? value.trim().slice(0, 250) : "";
}

function captureCampaignAttribution() {
  if (typeof window === "undefined") return {};

  const parameters = new URLSearchParams(window.location.search);
  const captured = Object.fromEntries(
    CAMPAIGN_PARAMETERS
      .map((key) => [key, cleanAttributionValue(parameters.get(key))])
      .filter(([, value]) => value),
  );

  try {
    const stored = JSON.parse(window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY) || "{}");
    const attribution = {
      ...stored,
      ...captured,
      landingPage: cleanAttributionValue(stored.landingPage || `${window.location.pathname}${window.location.search}`),
      referrer: cleanAttributionValue(stored.referrer || document.referrer),
    };
    window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
    return attribution;
  } catch {
    return {
      ...captured,
      landingPage: cleanAttributionValue(`${window.location.pathname}${window.location.search}`),
      referrer: cleanAttributionValue(document.referrer),
    };
  }
}

let campaignAttribution = captureCampaignAttribution();

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

export function getCampaignAttribution() {
  campaignAttribution = captureCampaignAttribution();
  return { ...campaignAttribution };
}
