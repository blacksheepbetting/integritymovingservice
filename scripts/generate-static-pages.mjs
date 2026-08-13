#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { buildStructuredData, seoPages } from "../src/seo.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const client = path.join(root, "dist", "client");
const shell = readFileSync(path.join(client, "index.html"), "utf8");
const serverEntry = path.join(root, "dist", "ssr", "entry-server.js");
const { renderApp } = await import(pathToFileURL(serverEntry).href);
const requestedSiteUrl = (process.env.PUBLIC_SITE_URL || "").trim();
const indexingAllowed = process.env.PUBLIC_INDEXING_ALLOWED === "true";

if (requestedSiteUrl && !requestedSiteUrl.startsWith("https://")) {
  throw new Error("PUBLIC_SITE_URL must be an absolute HTTPS URL.");
}
if (indexingAllowed && !requestedSiteUrl) {
  throw new Error("PUBLIC_INDEXING_ALLOWED=true requires PUBLIC_SITE_URL.");
}

const siteUrl = requestedSiteUrl ? `${requestedSiteUrl.replace(/\/+$/, "")}/` : "";

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function absoluteUrl(pathname) {
  return new URL(pathname.replace(/^\//, ""), siteUrl).href;
}

function appendHead(html, markup) {
  return html.replace("</head>", `${markup}\n  </head>`);
}

function render(page, forceNoindex = false) {
  const { meta } = page;
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const pageUrl = siteUrl ? absoluteUrl(page.path) : "";
  const robots = indexingAllowed && !forceNoindex ? "index, follow, max-image-preview:large" : "noindex, nofollow";
  let html = shell
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`)
    .replace(/<meta name="robots" content="[^"]*"\s*\/>/, `<meta name="robots" content="${robots}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${description}" />`)
    .replace('<div id="root"></div>', `<div id="root">${renderApp(page.path)}</div>`);

  if (siteUrl && !forceNoindex) {
    html = html
      .replace(/<meta property="og:image" content="[^"]*"\s*\/>/, `<meta property="og:image" content="${absoluteUrl("/og.png")}" />`)
      .replace(/<meta name="twitter:image" content="[^"]*"\s*\/>/, `<meta name="twitter:image" content="${absoluteUrl("/og.png")}" />`);
    html = appendHead(html, `    <link rel="canonical" href="${pageUrl}" />`);
    html = appendHead(html, `    <meta property="og:url" content="${pageUrl}" />`);
    const schema = buildStructuredData({ siteUrl, ...page });
    const schemaJson = JSON.stringify(schema).replaceAll("<", "\\u003c");
    html = appendHead(html, `    <script type="application/ld+json" data-static-structured-data="true">${schemaJson}</script>`);
  }

  return html;
}

for (const page of seoPages) {
  const directory = page.route ? path.join(client, page.route) : client;
  mkdirSync(directory, { recursive: true });
  writeFileSync(path.join(directory, "index.html"), render(page));
}

writeFileSync(
  path.join(client, "404.html"),
  render(
    {
      path: "/404.html",
      meta: { title: "Page Not Found | Integrity Moving Service", description: "The requested page could not be found." },
    },
    true,
  ),
);

if (indexingAllowed) {
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...seoPages.map((page) => `  <url><loc>${escapeHtml(absoluteUrl(page.path))}</loc></url>`),
    "</urlset>",
    "",
  ].join("\n");
  writeFileSync(path.join(client, "sitemap.xml"), sitemap);
  writeFileSync(path.join(client, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl("/sitemap.xml")}\n`);
} else {
  writeFileSync(path.join(client, "robots.txt"), "User-agent: *\nDisallow: /\n\n# Staging only. Indexing requires written launch approval.\n");
}

console.log(
  `Prerendered ${seoPages.length} complete HTML pages plus 404.html (${indexingAllowed ? "indexing enabled" : "staging noindex"})`,
);
