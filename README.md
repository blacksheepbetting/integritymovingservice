# Integrity Moving Service Website

High-performance, accessible website template for Integrity Moving Service, built around quote requests, clear calls, local SEO foundations, and an isolated Cloudflare Worker deployment.

## Current status

Pre-execution planning and staging only. The template is intentionally marked `noindex` until client approval and production launch.

Before launch, confirm in writing:

- final services and service areas
- approved photographs and logo files
- quote-form destination and lead owner
- analytics, advertising, and call-tracking configuration
- privacy and customer-facing policy content
- domain and Cloudflare deployment approval

## Local development

```sh
pnpm install
pnpm dev
```

## Production build

```sh
pnpm build
pnpm test
```

The build produces static client files in `dist/client`. The Worker in `worker/index.js` serves those assets, protects the quote endpoint with Cloudflare Turnstile, and sends validated quote requests through the restricted `QUOTE_EMAIL` binding.

The production site uses the client-owned GA4 stream `G-F69TY2D1E6`. It records page views, quote-form opens, completed quote requests, call-link clicks, and Google-review link clicks only on the production hostname. Advertising storage and personalization signals are denied by default.

The homepage contains `MovingCompany` and `WebSite` JSON-LD using facts verified from the existing Google Business Profile on August 14, 2026. The profile is currently awaiting Google re-verification, so the site intentionally omits the street address, broad service areas, review/aggregate-rating schema, and unsupported claims. Breadcrumb markup is intentionally omitted while the site has only one real page.

The Turnstile secret must be configured as a Cloudflare Worker secret named `TURNSTILE_SECRET`; it must never be committed. The email binding is restricted to `integritymovingservicellc@gmail.com` in `wrangler.jsonc`.

`pnpm deploy` creates or updates only the `integrity-moving-service` Worker. The production domain is connected separately after DNS activation and launch QA.

## Important launch note

Remove `<meta name="robots" content="noindex, nofollow" />` from `index.html` only after written approval to publish and index the production site.
