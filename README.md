# Integrity Moving Service Website

High-performance, accessible, HTML-first website for Integrity Moving Service, built around quote requests, clear calls, local SEO foundations, and Cloudflare-compatible static deployment.

## Current status

Pre-execution planning and staging only. The template is intentionally marked `noindex` until client approval and production launch.

Before launch, confirm in writing:

- final services and service areas
- approved photographs and logo files
- quote-form destination and lead owner
- analytics, advertising, and call-tracking configuration
- privacy and customer-facing policy content
- domain and Cloudflare deployment approval

The staging build includes:

- a conversion-focused homepage
- service overview plus local, interstate, residential, apartment, packing, loading/unloading, and storage pages
- service-area overview plus Indiana, Indianapolis, Lafayette, Illinois, Ohio, Michigan, and North Carolina pages
- About, Contact/Quote, Privacy, complete HTML Site Index, and not-found pages
- page-specific static metadata shells for direct navigation and search-engine rendering
- responsive navigation, mobile call action, breadcrumbs, accessible forms, and FAQ sections
- a reserved Google Reviews widget target and a documented Google Sheets CRM handoff
- unique page titles and descriptions, visible and JSON-LD breadcrumbs, Organization/WebSite/WebPage schema, and page-specific Service schema
- launch-gated absolute canonicals, Open Graph URLs, robots directives, and XML sitemap generation
- fully prerendered HTML for the homepage and every route; JavaScript enhances navigation and staged form behavior after the content is already available

The quote form is intentionally non-delivering in staging. It must be connected to approved secure storage, spam protection, notifications, lead-source capture, and analytics before launch.
See `INTEGRATIONS.md` for the widget target, proposed Sheet columns, source-attribution fields, and secure production flow.

## SEO launch controls

Copy `.env.example` into the approved hosting configuration and set the final HTTPS production domain as `PUBLIC_SITE_URL`. Keep `PUBLIC_INDEXING_ALLOWED=false` for all previews.

Only after written launch approval:

1. confirm the canonical domain and redirect plan
2. confirm every service and service area
3. replace the staged Organization annotation with full MovingCompany/LocalBusiness markup only after the physical address, hours, logo, and Google Business Profile URL are verified
4. set `PUBLIC_INDEXING_ALLOWED=true`
5. build and validate the generated canonicals, JSON-LD, `robots.txt`, and `sitemap.xml`
6. test representative URLs with Google's Rich Results Test and URL Inspection
7. submit the sitemap in the client-owned Search Console property

The site intentionally does not publish `FAQPage`, review, or aggregate-rating schema. FAQ rich results are generally unavailable to this type of business, and review markup must never be created from an empty widget or unverified data.

## Local development

```sh
pnpm install
pnpm dev
```

## Production build

```sh
pnpm build
pnpm test:sites
```

The build produces static client files in `dist/client` plus a Cloudflare-compatible worker bundle. Hosting metadata is copied when an approved hosting project has been configured.

## Important launch note

Remove `<meta name="robots" content="noindex, nofollow" />` from `index.html` and replace the staging `public/robots.txt` only after written approval to publish and index the production site.
