const SECURITY_HEADERS = {
  "content-security-policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "connect-src 'self' https://challenges.cloudflare.com https://www.google-analytics.com https://region1.google-analytics.com https://*.google-analytics.com",
    "font-src 'self' https://fonts.gstatic.com",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src https://challenges.cloudflare.com",
    "img-src 'self' data:",
    "object-src 'none'",
    "script-src 'self' https://challenges.cloudflare.com https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  ].join("; "),
  "permissions-policy": "camera=(), geolocation=(), microphone=()",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
};

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) headers.set(name, value);
  headers.set("strict-transport-security", "max-age=31536000; includeSubDomains");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function jsonResponse(body, status = 200) {
  return withSecurityHeaders(new Response(JSON.stringify(body), {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
    },
  }));
}

function clean(value, maximumLength) {
  return typeof value === "string" ? value.trim().slice(0, maximumLength) : "";
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character]);
}

function validateLead(raw) {
  const lead = {
    name: clean(raw.name, 100),
    email: clean(raw.email, 200),
    phone: clean(raw.phone, 30),
    movingFrom: clean(raw.movingFrom, 120),
    movingTo: clean(raw.movingTo, 120),
    moveDate: clean(raw.moveDate, 10),
    details: clean(raw.details, 1500),
    company: clean(raw.company, 120),
    consent: raw.consent === true,
    turnstileToken: clean(raw.turnstileToken, 2048),
  };

  if (lead.company) return { lead, isBot: true };

  const phoneDigits = lead.phone.replace(/\D/g, "");
  if (!lead.name || !lead.movingFrom || !lead.movingTo || !lead.moveDate || !lead.phone) {
    return { error: "Please complete every required field." };
  }
  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    return { error: "Please enter a valid phone number." };
  }
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return { error: "Please enter a valid email address." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(lead.moveDate)) {
    return { error: "Please choose a valid move date." };
  }
  if (!lead.consent) return { error: "Please confirm that we may contact you about the quote." };
  if (!lead.turnstileToken) return { error: "Please complete the security check." };

  return { lead, isBot: false };
}

async function verifyTurnstile(token, request, env) {
  if (!env.TURNSTILE_SECRET) return false;

  const formData = new FormData();
  formData.append("secret", env.TURNSTILE_SECRET);
  formData.append("response", token);
  const remoteIp = request.headers.get("cf-connecting-ip");
  if (remoteIp) formData.append("remoteip", remoteIp);

  const verifier = env.TURNSTILE_VERIFIER?.fetch
    ? env.TURNSTILE_VERIFIER.fetch.bind(env.TURNSTILE_VERIFIER)
    : fetch;
  const response = await verifier("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) return false;

  const result = await response.json();
  return result.success === true;
}

function formatLeadEmail(lead, request) {
  const receivedAt = new Date().toISOString();
  const rows = [
    ["Name", lead.name],
    ["Phone", lead.phone],
    ["Email", lead.email || "Not provided"],
    ["Moving from", lead.movingFrom],
    ["Moving to", lead.movingTo],
    ["Move date", lead.moveDate],
    ["Additional details", lead.details || "None provided"],
    ["Received", receivedAt],
    ["Website", new URL(request.url).hostname],
  ];

  const text = [
    "New quote request from chooseintegritymoving.com",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
  ].join("\n");

  const htmlRows = rows.map(([label, value]) => (
    `<tr><th align="left" style="padding:8px;border-bottom:1px solid #ddd">${escapeHtml(label)}</th>`
    + `<td style="padding:8px;border-bottom:1px solid #ddd">${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`
  )).join("");

  return {
    from: "quotes@chooseintegritymoving.com",
    to: "integritymovingservicellc@gmail.com",
    subject: `New moving quote: ${lead.movingFrom} to ${lead.movingTo}`,
    text,
    html: `<h1 style="font-family:Arial,sans-serif">New moving quote request</h1><table style="border-collapse:collapse;font-family:Arial,sans-serif">${htmlRows}</table>`,
  };
}

async function handleLeadRequest(request, env) {
  if (request.method !== "POST") {
    const response = jsonResponse({ error: "Method not allowed." }, 405);
    response.headers.set("allow", "POST");
    return response;
  }

  const requestOrigin = request.headers.get("origin");
  if (requestOrigin && requestOrigin !== new URL(request.url).origin) {
    return jsonResponse({ error: "Invalid request origin." }, 403);
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return jsonResponse({ error: "Request must be JSON." }, 415);
  }

  const bodyText = await request.text();
  if (bodyText.length > 20_000) return jsonResponse({ error: "Request is too large." }, 413);

  let raw;
  try {
    raw = JSON.parse(bodyText);
  } catch {
    return jsonResponse({ error: "Request body is invalid." }, 400);
  }

  const validation = validateLead(raw);
  if (validation.error) return jsonResponse({ error: validation.error }, 400);
  if (validation.isBot) return jsonResponse({ ok: true }, 202);

  if (!env.QUOTE_EMAIL?.send || !env.TURNSTILE_SECRET) {
    return jsonResponse({ error: "Quote delivery is temporarily unavailable." }, 503);
  }

  const turnstilePassed = await verifyTurnstile(validation.lead.turnstileToken, request, env);
  if (!turnstilePassed) {
    return jsonResponse({ error: "The security check expired. Please try again." }, 400);
  }

  await env.QUOTE_EMAIL.send(formatLeadEmail(validation.lead, request));
  return jsonResponse({ ok: true }, 202);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === "www.chooseintegritymoving.com" && ["GET", "HEAD"].includes(request.method)) {
      url.hostname = "chooseintegritymoving.com";
      return withSecurityHeaders(Response.redirect(url, 308));
    }

    if (url.pathname === "/api/leads") return handleLeadRequest(request, env);

    let response = await env.ASSETS.fetch(request);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");

    if (response.status === 404 && acceptsHtml && ["GET", "HEAD"].includes(request.method)) {
      const indexUrl = new URL(request.url);
      indexUrl.pathname = "/index.html";
      indexUrl.search = "";
      response = await env.ASSETS.fetch(new Request(indexUrl, request));
    }

    return withSecurityHeaders(response);
  },
};
