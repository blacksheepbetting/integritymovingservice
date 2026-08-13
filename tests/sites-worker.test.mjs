import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import worker from "../worker/index.js";

test("serves existing static assets without a fallback", async () => {
  const calls = [];
  const response = await worker.fetch(new Request("https://example.test/assets/app.js"), {
    ASSETS: {
      fetch: async (request) => {
        calls.push(new URL(request.url).pathname);
        return new Response("asset", { status: 200 });
      },
    },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/assets/app.js"]);
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

test("does not turn missing API or write requests into the app shell", async () => {
  for (const request of [
    new Request("https://example.test/api/missing", { headers: { accept: "application/json" } }),
    new Request("https://example.test/flow", { method: "POST", headers: { accept: "text/html" } }),
  ]) {
    let calls = 0;
    const response = await worker.fetch(request, {
      ASSETS: {
        fetch: async () => {
          calls += 1;
          return new Response("missing", { status: 404 });
        },
      },
    });

    assert.equal(response.status, 404);
    assert.equal(calls, 1);
  }
});

test("emits the files required by Sites packaging", async () => {
  await access(new URL("../dist/client/index.html", import.meta.url));
  await access(new URL("../dist/server/index.js", import.meta.url));
});

test("emits a working root index entry", async () => {
  const home = await readFile(new URL("../dist/client/index.html", import.meta.url), "utf8");

  assert.match(home, /<title>Indianapolis &amp; Lafayette Movers \| Integrity Moving Service<\/title>/);
  assert.match(home, /<div id="root">[\s\S]*<h1 id="home-title">A Clearer Plan/);
  assert.match(home, /<form class="quote-form quote-form--compact"/);
  assert.match(home, /<script type="module" crossorigin src="\/assets\/index-[^"]+\.js"><\/script>/);
});

test("emits complete HTML for every public staging route", async () => {
  const routes = [
    "services",
    "service-areas",
    "about",
    "contact",
    "privacy",
    "site-index",
    "services/local-moving",
    "services/interstate-moving",
    "services/residential-moving",
    "services/apartment-moving",
    "services/packing-services",
    "services/loading-unloading",
    "services/storage",
    "service-areas/indiana",
    "service-areas/indianapolis",
    "service-areas/lafayette",
    "service-areas/illinois",
    "service-areas/ohio",
    "service-areas/michigan",
    "service-areas/north-carolina",
  ];

  for (const route of routes) {
    const html = await readFile(new URL(`../dist/client/${route}/index.html`, import.meta.url), "utf8");
    assert.match(html, /<main id="main-content">/);
    assert.match(html, /<h1[^>]*>/);
  }
});

test("keeps preview builds out of search until launch approval", async () => {
  const [home, robots] = await Promise.all([
    readFile(new URL("../dist/client/index.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/robots.txt", import.meta.url), "utf8"),
  ]);

  assert.match(home, /name="robots" content="noindex, nofollow"/);
  assert.doesNotMatch(home, /rel="canonical"/);
  assert.match(robots, /Disallow: \//);
});
