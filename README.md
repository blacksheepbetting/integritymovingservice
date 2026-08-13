# Integrity Moving Service Website

High-performance, accessible website template for Integrity Moving Service, built around quote requests, clear calls, local SEO foundations, and Cloudflare-ready static deployment.

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
pnpm test:sites
```

The build produces static client files in `dist/client` plus the bundled hosting worker and metadata.

## Important launch note

Remove `<meta name="robots" content="noindex, nofollow" />` from `index.html` only after written approval to publish and index the production site.

