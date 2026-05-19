---
title: Build Orchestration
captured_at: 2026-05-10
purpose: Document how npm scripts and wrangler config wire together build-time tooling so graphify can map orchestration relationships.
---

# Build Orchestration

This document describes how `package.json` scripts and `wrangler.toml` connect the build-time tooling (audits, image conversion, postbuild steps) into a coherent pipeline.

## npm scripts (package.json)

The project's `package.json` defines these scripts that orchestrate the build flow:

```json
{
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build && node scripts/postbuild-csp.mjs",
    "preview": "astro preview",
    "astro": "astro",
    "typecheck": "tsc --noEmit"
  }
}
```

The `build` script chains two steps:

1. **`astro build`** — runs the Astro build, producing `dist/`
2. **`node scripts/postbuild-csp.mjs`** — runs `postbuild-csp.mjs` against the built `dist/` folder. This script extracts inline script hashes for CSP and (when `DEPLOY_ENV=staging`) injects an `X-Robots-Tag: noindex` header into `dist/_headers`.

So `package.json` `build` script orchestrates `astro build` and `scripts/postbuild-csp.mjs`. The build script is the orchestration entry point.

## Build-time audit scripts

After the build completes, several optional QA scripts can be run against `dist/`:

- `scripts/audit-headings.mjs` — heading hierarchy audit (H1 count, skips, empties)
- `scripts/audit-meta.mjs` — meta tag audit (title, description, canonical, og:locale)
- `scripts/audit-schema.mjs` — JSON-LD schema audit (parses ld+json blocks)
- `scripts/bundle-size-budget.mjs` — bundle size budget assertion
- `scripts/postbuild-csp.mjs` — CSP hash injection (the only one wired into npm build script)
- `scripts/compare-lighthouse.mjs` — compare Lighthouse live vs dev mobile/desktop
- `scripts/dig-lighthouse-issues.mjs` — Lighthouse audit JSON deep-dive (contrast + tap-target)
- `scripts/mobile-qa.mjs` — Playwright multi-viewport multi-page mobile QA
- `scripts/dig-tap-targets.mjs` — Playwright dig tap-targets <30px (mobile viewport)
- `scripts/screenshot-dev.mjs` — Playwright screenshot dev pages (desktop + mobile)
- `scripts/indexnow-ping.js` — IndexNow API endpoint ping after deploy

These are NOT chained into `npm run build` automatically. They're standalone tools invoked manually or via CI.

## Image conversion pipeline scripts

These run as preprocessing on `public/images/` before the Astro build:

- `scripts/convert-to-webp.js` — convertFile (sharp pipeline, q82 effort 6, 1920px max)
- `scripts/convert-webp.mjs` — convertToWebP (tfdm path, q80)
- `scripts/generate-avif.mjs` — AVIF generator
- `scripts/optimize-hero-images.mjs` — orchestrates hero image optimization
- `scripts/process-heic.mjs` — HEIC processor (iPhone photo conversion)
- `scripts/gen-favicons.mjs` — generate favicons + apple-touch-icon from SVG
- `scripts/download-fonts.mjs` — download Google Fonts woff2 latin subset locally

All of these run independently as one-off tasks; none are wired into the Astro build pipeline. They share the common pattern of "sharp resize + re-encode image pipeline".

## SEO update pipeline (3 steps via Shopify Admin API)

The SEO update pipeline is a separate orchestration in `scripts/seo/`:

1. **`scripts/seo/1-audit.mjs`** — fetches all Shopify products + metafields, writes baseline JSON
2. **`scripts/seo/2-plan.mjs`** — reads audit JSON, derives proposed-change CSV preview
3. **`scripts/seo/3-pdf-brief.mjs`** — reads plan JSON, generates client-friendly HTML PDF brief

These are chained by file IO: 1 writes `audit-YYYY-MM-DD.json`, 2 reads it and writes `plan-YYYY-MM-DD.json`, 3 reads that and writes the HTML/PDF brief. The shared module `scripts/seo/lib.mjs` provides authentication (`getAdminToken`, `adminFetch`) and helpers (`saveText`, `fetchAllProducts`, `fetchProductMetafields`).

## wrangler.toml — Cloudflare Workers deployment config

```toml
name = "baitboards"
account_id = "461230c094898d0e79b1cafa18b80189"
compatibility_date = "2026-05-06"
compatibility_flags = ["nodejs_compat"]
main = "worker.js"
workers_dev = false

[assets]
directory = "./dist"
binding = "ASSETS"
not_found_handling = "404-page"

[env.staging]
name = "baitboards-dev"
workers_dev = true

[env.staging.assets]
directory = "./dist"
binding = "ASSETS"
not_found_handling = "404-page"

[env.production]
name = "baitboards"
workers_dev = false
routes = [
  { pattern = "baitboardsdirect.com/*", zone_name = "baitboardsdirect.com" },
  { pattern = "www.baitboardsdirect.com/*", zone_name = "baitboardsdirect.com" },
]

[env.production.assets]
directory = "./dist"
binding = "ASSETS"
not_found_handling = "404-page"
```

This config:
- Tells Cloudflare which Worker file to deploy (`worker.js` — the same file that contains the `fetch` handler and references `redirects.js` via `matchRedirect`)
- Binds the `dist/` directory as `ASSETS` so `worker.js` can call `env.ASSETS.fetch()` to serve static files
- Defines two environments — `staging` (deploys to `baitboards-dev.workers.dev`) and `production` (deploys to `baitboardsdirect.com`)

## Dependencies map

The `package.json` dependencies determine which runtime libraries the codebase imports:

- `astro` — the static site generator; everything in `src/pages/` and `src/components/` uses it
- `@astrojs/sitemap` — sitemap generator integration; configured in `astro.config.mjs`
- `@astrojs/svelte` — Svelte component support; used by `AddToCartForm.svelte`, `CartDrawer.svelte`, `CartIcon.svelte`, `Money.svelte`, `ShopifyImage.svelte`
- `@nanostores/persistent` — persistent localStorage state; used by `src/stores/cart.ts`
- `nanostores` — reactive state primitive; underlies the cart store
- `@tailwindcss/vite` — Tailwind CSS Vite plugin; integrated via `astro.config.mjs`
- `svelte` — the component framework
- `zod` — runtime schema validation; used by `src/utils/schemas.ts` for Shopify GraphQL response types

Dev dependencies orchestrate build tooling:
- `wrangler` — Cloudflare Workers CLI (deploys `worker.js` to the edge)
- `prettier` + `prettier-plugin-astro` + `prettier-plugin-tailwindcss` — code formatting
- `tailwindcss` — utility CSS framework
- `typescript` — type checking via `npm run typecheck`

## Cross-references

- `worker.js` is referenced by `wrangler.toml` (`main = "worker.js"`)
- `dist/` is referenced by `wrangler.toml` (`[assets].directory = "./dist"`) and is the output of `astro build`
- `scripts/postbuild-csp.mjs` is referenced by `package.json` (`build` script chains it)
- `cart.ts` imports from `shopify.ts`; `shopify.ts` imports from `schemas.ts`, `graphql.ts`, `config.ts`
- `BaseLayout.astro` is imported by all top-level pages (`index.astro`, `about.astro`, `contact.astro`, `faqs.astro`, etc.)
- `AddToCartForm.svelte` is imported by `src/pages/products/[...handle].astro` (the PDP)
- `CartDrawer.svelte` and `CartIcon.svelte` are imported by `Header.astro` (rendered in BaseLayout)
- `ProductCard.astro` is imported by collection pages (`bait-boards.astro`, `on-sale.astro`, etc.)
- `Money.svelte` and `ShopifyImage.svelte` are imported by `ProductCard.astro` and the PDP
- `quiz.ts` (with `ALL_COMBOS`, `FISHING_OPTIONS`, `BOAT_OPTIONS`, `RODS_OPTIONS`, `getRecommendation`, `describeAnswers`) is imported by `src/pages/help-me-choose.astro` and `src/pages/help-me-choose/result/[combo].astro`
- `redirects.js` exports `matchRedirect` which is imported by `worker.js`
- `site.ts` exports the centralized site config; imported by `BaseLayout.astro` and several pages
