import assert from "node:assert/strict";
import test from "node:test";
import { buildStructuredData, seoPages } from "../src/seo.js";

test("every indexable page has unique, concise SEO copy", () => {
  assert.equal(seoPages.length, 21);
  assert.equal(new Set(seoPages.map((page) => page.path)).size, seoPages.length);
  assert.equal(new Set(seoPages.map((page) => page.meta.title)).size, seoPages.length);
  assert.equal(new Set(seoPages.map((page) => page.meta.description)).size, seoPages.length);

  for (const page of seoPages) {
    assert.ok(page.meta.title.length >= 30, `${page.path} title is too short`);
    assert.ok(page.meta.title.length <= 60, `${page.path} title is too long`);
    assert.ok(page.meta.description.length >= 120, `${page.path} description is too short`);
    assert.ok(page.meta.description.length <= 160, `${page.path} description is too long`);
  }
});

test("service schema is absolute, page-specific, and does not invent review data", () => {
  const page = seoPages.find((item) => item.path === "/services/local-moving/");
  const schema = buildStructuredData({ siteUrl: "https://choose.example/", ...page });
  const types = schema["@graph"].map((item) => item["@type"]);
  const json = JSON.stringify(schema);

  assert.deepEqual(types, ["Organization", "WebSite", "WebPage", "BreadcrumbList", "Service"]);
  assert.equal(schema["@graph"][0].additionalType, "https://schema.org/MovingCompany");
  assert.match(json, /https:\/\/choose\.example\/services\/local-moving\//);
  assert.match(json, /Local Moving/);
  assert.doesNotMatch(json, /aggregateRating|ratingValue|reviewRating/);
});

test("area schema describes only the visible page area", () => {
  const page = seoPages.find((item) => item.path === "/service-areas/lafayette/");
  const schema = buildStructuredData({ siteUrl: "https://choose.example/", ...page });
  const service = schema["@graph"].find((item) => item["@id"]?.endsWith("#service-area"));

  assert.deepEqual(service.areaServed, [
    { "@type": "City", name: "Lafayette" },
    { "@type": "City", name: "West Lafayette" },
  ]);
});
