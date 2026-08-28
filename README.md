# Integrity Moving Service Website

High-performance, accessible website template for Integrity Moving Service, built around quote requests, clear calls, local SEO foundations, and an isolated Cloudflare Worker deployment.

## Current status

Pre-execution planning. The website and approved service page are live, while search indexing remains disabled pending separate written indexing approval.

### Approved live update

- `/junk-removal/` is an approved, SEO-ready service page. Its publication and change-order approvals were confirmed before deployment.
- `/services/` refreshes the service hub that exists on the legacy Wix site with approved, cautious descriptions for local moving, long-distance moving, storage, packing and unpacking, and junk removal.
- The quote form records whether the customer needs packing services and includes the answer in the fixed-inbox notification.
- The quote form also records the requested service and first-session campaign attribution, including UTM parameters and Google click identifiers when present.
- The client-approved logo appears in the website header.

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

The homepage contains `MovingCompany`, `WebSite`, and service-catalog JSON-LD using verified business facts and service descriptions from the legacy client site. The profile is currently awaiting Google re-verification, so the site intentionally omits the street address, broad service areas, review/aggregate-rating schema, and unsupported claims. The services and junk-removal pages include page-specific service/list and breadcrumb markup; the homepage intentionally omits breadcrumb markup.

The advertising-readiness plan is documented in `docs/advertising-readiness.md`. It defines the audience, offer, final URLs, measurement, owner, launch gates, KPIs, and adjustment rules without launching ads or authorizing spend.

The Turnstile secret must be configured as a Cloudflare Worker secret named `TURNSTILE_SECRET`; it must never be committed. The email binding is restricted to `integritymovingservicellc@gmail.com` in `wrangler.jsonc`.

`pnpm deploy` creates or updates only the `integrity-moving-service` Worker. The production domain is connected separately after DNS activation and launch QA.

## Important launch note

Remove `<meta name="robots" content="noindex, nofollow" />` from `index.html` only after written approval to publish and index the production site.
