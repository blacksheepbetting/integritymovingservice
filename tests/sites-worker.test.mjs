import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import worker from "../worker/index.js";

function assetsReturning(status = 404, body = "missing") {
  return { fetch: async () => new Response(body, { status }) };
}

function validLead(overrides = {}) {
  return {
    name: "Test Customer",
    email: "customer@example.com",
    phone: "317-555-0142",
    movingFrom: "Indianapolis, IN",
    movingTo: "Carmel, IN",
    moveDate: "2026-09-01",
    packingServices: "No",
    details: "Two-bedroom apartment",
    company: "",
    consent: true,
    turnstileToken: "test-token",
    ...overrides,
  };
}

test("serves static assets with security headers", async () => {
  const response = await worker.fetch(new Request("https://example.test/assets/app.js"), {
    ASSETS: assetsReturning(200, "asset"),
  });

  assert.equal(response.status, 200);
  assert.equal(await response.text(), "asset");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.match(response.headers.get("content-security-policy"), /frame-ancestors 'none'/);
  assert.match(response.headers.get("content-security-policy"), /googletagmanager\.com/);
  assert.match(response.headers.get("content-security-policy"), /google-analytics\.com/);
});

test("falls back to index.html for an unknown app route", async () => {
  const calls = [];
  const response = await worker.fetch(
    new Request("https://example.test/flow/step-two?source=share", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async (request) => {
          const url = new URL(request.url);
          calls.push(url.pathname + url.search);
          return new Response(url.pathname === "/index.html" ? "app" : "missing", {
            status: url.pathname === "/index.html" ? 200 : 404,
          });
        },
      },
    },
  );

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/flow/step-two?source=share", "/index.html"]);
});

test("redirects www traffic to the canonical domain", async () => {
  const response = await worker.fetch(
    new Request("https://www.chooseintegritymoving.com/services?source=www"),
    {},
  );

  assert.equal(response.status, 308);
  assert.equal(response.headers.get("location"), "https://chooseintegritymoving.com/services?source=www");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
});

test("accepts a validated quote and sends it to the fixed inbox", async () => {
  const messages = [];
  const request = new Request("https://chooseintegritymoving.com/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://chooseintegritymoving.com" },
    body: JSON.stringify(validLead()),
  });
  const response = await worker.fetch(request, {
    TURNSTILE_SECRET: "test-secret",
    TURNSTILE_VERIFIER: { fetch: async () => Response.json({ success: true }) },
    QUOTE_EMAIL: { send: async (message) => messages.push(message) },
  });

  assert.equal(response.status, 202);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(messages.length, 1);
  assert.equal(messages[0].to, "integritymovingservicellc@gmail.com");
  assert.match(messages[0].subject, /Indianapolis, IN to Carmel, IN/);
  assert.match(messages[0].text, /Test Customer/);
  assert.match(messages[0].text, /Packing services needed: No/);
});

test("serves the dedicated junk-removal page for its clean route", async () => {
  const calls = [];
  const response = await worker.fetch(
    new Request("https://chooseintegritymoving.com/junk-removal", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async (request) => {
          const pathname = new URL(request.url).pathname;
          calls.push(pathname);
          return new Response("junk removal page", { status: 200 });
        },
      },
    },
  );

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/junk-removal/index.html"]);
});

test("rejects an expired security check without sending email", async () => {
  let sendCount = 0;
  const response = await worker.fetch(new Request("https://example.test/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(validLead()),
  }), {
    TURNSTILE_SECRET: "test-secret",
    TURNSTILE_VERIFIER: { fetch: async () => Response.json({ success: false }) },
    QUOTE_EMAIL: { send: async () => { sendCount += 1; } },
  });

  assert.equal(response.status, 400);
  assert.equal(sendCount, 0);
});

test("silently accepts honeypot submissions without email delivery", async () => {
  let sendCount = 0;
  const response = await worker.fetch(new Request("https://example.test/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(validLead({ company: "Spam Company" })),
  }), {
    QUOTE_EMAIL: { send: async () => { sendCount += 1; } },
  });

  assert.equal(response.status, 202);
  assert.equal(sendCount, 0);
});

test("rejects missing required lead fields", async () => {
  const response = await worker.fetch(new Request("https://example.test/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(validLead({ phone: "" })),
  }), {});

  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /required/i);
});

test("rejects an invalid packing-services answer", async () => {
  const response = await worker.fetch(new Request("https://example.test/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(validLead({ packingServices: "Maybe" })),
  }), {});

  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /packing services/i);
});

test("build emits the Cloudflare static asset entry point", async () => {
  await access(new URL("../dist/client/index.html", import.meta.url));
  await access(new URL("../dist/client/junk-removal/index.html", import.meta.url));
  await access(new URL("../dist/client/assets/placeholder-logo.JPEG", import.meta.url));
});

test("build includes canonical metadata and truthful business schema", async () => {
  const html = await readFile(new URL("../dist/client/index.html", import.meta.url), "utf8");
  const analytics = await readFile(new URL("../src/analytics.js", import.meta.url), "utf8");

  assert.match(html, /rel="canonical" href="https:\/\/chooseintegritymoving\.com\/"/);
  assert.match(html, /"@type": "MovingCompany"/);
  assert.match(analytics, /G-F69TY2D1E6/);
  assert.doesNotMatch(html, /aggregateRating|BreadcrumbList/);
});

test("build publishes crawler discovery files", async () => {
  const robots = await readFile(new URL("../dist/client/robots.txt", import.meta.url), "utf8");
  const sitemap = await readFile(new URL("../dist/client/sitemap.xml", import.meta.url), "utf8");

  assert.match(robots, /Sitemap: https:\/\/chooseintegritymoving\.com\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/chooseintegritymoving\.com\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/chooseintegritymoving\.com\/junk-removal\/<\/loc>/);
});

test("junk-removal page includes approved SEO metadata and schema", async () => {
  const html = await readFile(new URL("../dist/client/junk-removal/index.html", import.meta.url), "utf8");

  assert.match(html, /<title>Junk Removal in Indianapolis \| Integrity Moving Service<\/title>/);
  assert.match(html, /rel="canonical" href="https:\/\/chooseintegritymoving\.com\/junk-removal\/"/);
  assert.match(html, /"@type": "Service"/);
  assert.match(html, /"@type": "BreadcrumbList"/);
  assert.match(html, /name="robots" content="noindex, nofollow"/);
});
