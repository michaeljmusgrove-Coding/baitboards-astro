# Technical SEO Audit — baitboardsdirect.com (Post-Cutover)

**Audit date:** 2026-05-20 (cutover day, ~T+4 hours)
**Auditor:** Technical SEO sub-skill (curl + PSI v5 API + raw HTML inspection)
**Scope:** apex `https://baitboardsdirect.com` — Astro 4 static build on Cloudflare Workers (Static Assets)
**Build:** Astro v5.18.1 (from `<meta name="generator">`), `_astro/*` immutable assets, 22 products + 6 articles + 5 collections + 19 help-me-choose result pages
**Out of scope:** the dormant `www` subdomain (stuck on Shopify's CF-for-SaaS claim; apex-canonical is the intentional pivot), the Shopify checkout subdomain (`baitboardsdirect.myshopify.com/checkouts/...` — Option A headless hand-off, by design)

---

## Executive summary

The post-cutover site is in **strong technical health**. Crawlability, indexability, security headers, structured data coverage, canonical consistency, redirect chains, robots.txt, and mobile rendering are all clean or near-clean. Desktop Lighthouse scores 96/96/92/92 (perf/a11y/best-practices/SEO); mobile is 83/96/92/92. Core Web Vitals lab data on mobile shows LCP in the "needs improvement" band (3.4 s home, 3.6 s PDP, 3.9 s collection) — primarily a Shopify-CDN PNG image weight issue on PDPs and a JavaScript total-blocking-time of 340–940 ms.

**Overall technical score: 87 / 100.**

There are three real HIGH-severity findings to address before the whitepaper Day-30 milestone — most importantly, a **CSP gap blocking Google Ads conversion endpoints**, which will silently break Ads tracking when paid campaigns launch. The remaining items are MEDIUM/LOW — sitemap `lastmod` absence, mobile PDP LCP, a broken `SearchAction` URL template, link-text descriptiveness, and supplementary files (favicon.ico, manifest).

There are **no critical blockers** for indexing, crawling, or organic ranking. The site is ready to be submitted to GSC and Bing Webmaster Tools today.

---

## Category scores

| Category | Status | Score | Notes |
|---|---|---|---|
| Crawlability | PASS | 95 | robots.txt clean, sitemap valid, 200 on all key URLs, 404 noindexed |
| Indexability | PASS | 92 | Canonical consistent, hreflang set, no thin/duplicate content |
| Security headers | PASS | 96 | HSTS preload, CSP strict (hash-based), XFO/XCTO/Referrer-Policy/Permissions-Policy all set |
| URL structure | PASS | 95 | Trailing slash 301→no-slash, HTTP→HTTPS upgrade, 33 legacy redirects working |
| Mobile | PASS | 94 | viewport correct, responsive images, touch targets fine, color-contrast caveat |
| Core Web Vitals | NEEDS WORK | 72 | Desktop excellent (LCP 1.1s), mobile LCP 3.4–3.9s (needs improvement band) |
| Structured data | PASS | 88 | Product+Offer+Shipping+ReturnPolicy, Article, BreadcrumbList, FAQPage, OnlineStore, Person, WebSite — all present; one broken `SearchAction` urlTemplate |
| JavaScript rendering | PASS | 100 | SSR Astro, all islands `client="idle"` or `load`, no hydration-blocked first paint |
| Accessibility | NEEDS WORK | 84 | 23 color-contrast failures on accent `#008c9e` (4.0:1 vs required 4.5:1) |
| IndexNow | UNWIRED | 50 | `scripts/indexnow-ping.js` exists but no GitHub Actions wiring + no key file in `public/` |

---

## Findings table

| # | Priority | Category | Finding | Affected URLs | Recommendation |
|---|---|---|---|---|---|
| 1 | HIGH | Tracking / CSP | CSP `connect-src` blocks Google Ads conversion + remarketing endpoints. PSI flagged 19 console-error refusals against `www.google.com/ccm/collect`, `www.google.com/g/collect`, `analytics.google.com/g/collect`, `stats.g.doubleclick.net/g/collect`, `www.google.com/measurement/conversion`, `www.google.com/rmkt/collect/...`, `www.merchant-center-analytics.goog/mc/collect`. GA4 page_view fires fine via `*.googletagmanager.com` and `*.google-analytics.com`, but Ads conversion/remarketing pings are dropped. With Google Ads launching post-cutover, this silently breaks conversion attribution. | sitewide (AW-11239965483) | Add to `connect-src` in `public/_headers`: `https://www.google.com https://stats.g.doubleclick.net https://www.merchant-center-analytics.goog`. Redeploy and verify in DevTools Network → no `(blocked:csp)` rows on `*google.com/ccm`/`*google.com/g/collect`/`*doubleclick.net` requests. |
| 2 | HIGH | Core Web Vitals | Mobile LCP 3.4–3.9 s ("needs improvement" band). On PDPs, the hero gallery image is a **577 KB Shopify-CDN PNG** (`...seaking-bait-board-b01-1.png?...&width=1200`) — PNG, not WebP/AVIF. Astro's preload + `fetchpriority="high"` + `loading="eager"` are all correctly set on the LCP element; the bottleneck is image weight, not the loading strategy. | All 22 PDPs | Add `&format=webp` to the Shopify CDN image URLs in `ProductGallery.astro` (and any other component referencing `cdn.shopify.com/.../files/*.png`). Shopify CDN supports `format=webp` and `format=avif` transformations. Expected mobile LCP improvement: ~1.0–1.5 s. Verify with `curl -I "...&format=webp"` → should return `Content-Type: image/webp` and ~5–8× smaller `Content-Length`. |
| 3 | HIGH | Structured data | `WebSite` schema's `SearchAction.target.urlTemplate` points to `https://baitboardsdirect.com/products?q={search_term_string}` — but `/products` returns 404 (no route exists; Shopify-style `/search` 301s to `/collections/bait-boards`). This is a broken structured-data signal; Google may either suppress the Sitelinks Search Box feature or log a warning in GSC's "Sitelinks searchbox" report. | Every page (WebSite schema injected globally) | Either (a) point urlTemplate to `https://baitboardsdirect.com/collections/bait-boards?q={search_term_string}` and add server-side query-string handling, OR (b) remove the `potentialAction` block entirely since the site has no real on-site search UI. Option (b) is cleaner given no search component is in scope. Update `BaseLayout.astro` (or wherever WebSite JSON-LD is emitted). |
| 4 | MEDIUM | Crawlability | Sitemap has **no `<lastmod>`, `<changefreq>`, or `<priority>` elements** — every `<url>` is just a `<loc>`. Google's crawl scheduler uses `lastmod` heavily; without it, re-crawl latency after a deploy is days-to-weeks rather than hours-to-days. Especially relevant since Astro is rebuilding on every Shopify webhook event. | `/sitemap-0.xml` (72 URLs) | Switch `astro.config.mjs` sitemap integration to emit `lastmod` from build date OR from per-page `frontmatter.updatedAt`. Astro's `@astrojs/sitemap` supports `lastmod` via the `serialize` option. Set `lastmod: new Date().toISOString()` at build time as a baseline. |
| 5 | MEDIUM | Core Web Vitals | Mobile homepage TBT 340 ms; PDP TBT 940 ms. Suggests heavier-than-ideal JavaScript main-thread work. Likely culprits: GTM (`GTM-MMB4D7LX`) + GA4 (`G-GTL98BHGVW`) + Google Ads (`AW-11239965483`) + Microsoft Clarity all loading on every page. Clarity in particular is famously expensive on mobile main-thread. | sitewide | Audit GTM container — defer Google Ads conversion tag until consent + post-interaction. Move Microsoft Clarity behind a `requestIdleCallback` + 3 s timeout. Consider partytown for GTM if TBT remains >250 ms after format=webp fix. |
| 6 | MEDIUM | Tracking | IndexNow protocol is **not wired**. `scripts/indexnow-ping.js` exists but: (a) no `INDEXNOW_KEY` env var is configured, (b) no `{KEY}.txt` file in `public/`, (c) `.github/workflows/deploy.yml` doesn't invoke the script. Note: the user's global CLAUDE.md states IndexNow is wired at the deploy layer across the portfolio — this repo appears to be the exception. With Bing/Yandex/Naver crawlers in `robots.txt` explicitly allowed, IndexNow would accelerate their indexation by hours-to-days. | n/a (deploy layer) | Generate a 32-char hex IndexNow key, store as GitHub secret `INDEXNOW_KEY`, publish the matching `public/{KEY}.txt` file, and add a `Submit URLs to IndexNow` step to `deploy.yml` that pipes the sitemap URLs to `scripts/indexnow-ping.js` after the Cloudflare deploy succeeds. (Or confirm with the user that the deploy-layer IndexNow on the portfolio template applies here too and only the key file needs publishing.) |
| 7 | MEDIUM | Indexability / SEO copy | PDP `<title>` and `<meta name="description">` show **mid-sentence truncation** on at least one product. `/products/bait-board-b01`: title = "SeaKing Bait Board B01 (650mm x 430mm) & 2 Game Rated Rod" (cuts off "Holders"); description = "...Free Australia-wide shipping, 1-year" (cuts off "warranty"). The H1 and OG tags show the full title, so the truncation is in Shopify's `seo.title` metafield (70-char limit) and `seo.description` (160-char limit) — likely a side-effect of the apply script earlier today not accounting for character limits. | At least `/products/bait-board-b01`; needs audit across all 22 PDPs | Re-run the apply script (`scripts/seo/4-apply.mjs`) with a smarter truncation: clip at the last whole word before 60 chars (title) / 155 chars (description) so trailing words don't get half-cut. Re-fetch all 22 PDPs and confirm no titles/descriptions end mid-word. |
| 8 | MEDIUM | Accessibility / SEO | PSI logged **23 color-contrast failures** on accent color `#008c9e` (cyan/teal). Foreground 4.0:1 vs WCAG AA required 4.5:1. Affects CTA buttons ("SHOP BAIT BOARDS", "LEARN MORE", "EXPLORE"), category cards, and product meta text. Not a ranking factor directly, but contributes to the 96 → 100 accessibility score gap and is a real UX issue for users with low vision. | sitewide (any element using `#008c9e` foreground on white or white on `#008c9e` at <bold/<18 pt) | Darken the accent to `#007a8a` (gives 4.6:1 on white) or use `#00697a` (5.2:1 — safer). Update Tailwind config `theme.colors.accent` and the inline `text-[#008c9e]` / `bg-[#008c9e]` utility classes across `.astro` files. |
| 9 | LOW | SEO copy | One link with non-descriptive text: `<a href="/about">Learn more</a>` on homepage. PSI flagged it under `link-text`. Search engines and screen readers prefer link text that describes the destination. | Homepage | Change to "Learn more about Bait Boards Direct" or "Read our founder story". Trivial edit in the homepage `.astro` component. |
| 10 | LOW | Caching | `Cache-Control` on `/_astro/*` immutable assets is **duplicated**: the response header carries `public, max-age=300, s-maxage=3600, stale-while-revalidate=86400, public, max-age=31536000, immutable`. The wildcard `/*` block in `_headers` is matching first, then the `/_astro/*` block appends. CDN parsers handle this (RFC 7234 says "most restrictive wins" — so the immutable wins), but it's untidy and may confuse intermediate caches. | `/_astro/*`, `/fonts/*`, `/images/*` | In `public/_headers`, remove `Cache-Control` from the wildcard `/*` block and let only the specific paths set it. Or move the immutable directive earlier. Astro's Cloudflare adapter docs show the same pattern; test by running `curl -I https://baitboardsdirect.com/_astro/<file>.js` and confirming a single `Cache-Control:` line. |
| 11 | LOW | Discovery files | Missing supplementary files: `/favicon.ico` → 404 (the site only ships `/favicon.png` + `/favicon.svg`), `/apple-touch-icon.png` → 404, `/manifest.webmanifest` and `/site.webmanifest` → 404, `/.well-known/security.txt` → 404. The favicon link in `<head>` references `/favicon.png` correctly so browsers work — but older crawlers/feed readers and the Bing favicon API auto-request `/favicon.ico`. | n/a (file generation) | Add `public/favicon.ico` (multi-size ICO with 16, 32, 48 px frames). Add `public/apple-touch-icon.png` (180×180). Add a minimal `public/site.webmanifest` for PWA-aware browsers. `security.txt` is optional but a nice signal. |
| 12 | LOW | Structured data | Article schema's `url`, `mainEntityOfPage.@id`, and `@id` use **trailing-slash** URLs (`/articles/how-to-install-a-bait-board/`) while the page's `<link rel="canonical">` is no-slash (`/articles/how-to-install-a-bait-board`). Both resolve to the same canonical (trailing slash 301s to no-slash via the Worker), so Google will reconcile, but for crispness the schema should match canonical exactly. | All 6 article pages | In `ArticleLayout.astro` (or wherever Article JSON-LD is emitted), strip trailing slash from `url` and `@id` fields. |
| 13 | LOW | URL hygiene | Case-sensitive routing: `/SITEMAP.XML`, `/Products/bait-board-b01`, `/Collections/bait-boards` all return 404. Google's crawler is case-aware so this won't cost indexing, but external referrers sometimes mangle URL case (email clients, Office documents). | n/a | Optionally add case-normalisation to `worker.js` — lowercase the pathname before checking redirects and asset fetch. Or accept this; the impact is genuinely low. |
| 14 | LOW | Redirect granularity | The `fromPrefix: '/blogs'` and `fromPrefix: '/account'` rules collapse **all** legacy Shopify blog URLs and **all** account paths to `/`. Anyone landing on an old `/blogs/news/some-post` permalink ends up at the homepage rather than the closest match. Not many of these inbound URLs exist (the site never published a blog), but if Ahrefs shows any backlinks to `/blogs/...`, those should be mapped to `/articles/...` explicitly. | `/blogs/*`, `/account/*` | Optional: pull Ahrefs `backlinks` for `*/blogs/*` paths and add explicit `from:` redirects to the matching `/articles/*` slugs. Low-impact unless inbound links exist. |
| 15 | INFO | Robots.txt | Robots.txt is comprehensive and correctly structured: explicit `Allow: /` for 17 AI search and crawl bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bingbot, etc.), explicit `Disallow: /` for CCBot (training-only, no commercial benefit), and the sitemap is declared. No issues. | n/a | No action. This is reference-quality. |
| 16 | INFO | Hreflang | Single-locale `en-AU` + `x-default` both pointing to the same URL is the correct convention for a single-locale site. The seo-hreflang skill would only flag this if multi-locale was in scope (it isn't). | n/a | No action. |
| 17 | INFO | JavaScript rendering | Astro is shipping HTML-first with all critical content in the SSR markup. Svelte islands (`CartDrawer`, `CartIcon`, `AddToCartForm`) are correctly tagged `client="idle"` (cart) or `client="load"` (add-to-cart) — none gate first paint. Googlebot will see fully-rendered HTML with no JS dependency for content. | n/a | No action. This is exemplary headless-Astro behaviour. |
| 18 | INFO | Security headers | HSTS `max-age=15552000; includeSubDomains; preload` (180 days), X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy locking down camera/mic/geolocation/payment, CSP hash-based (no `unsafe-inline` on scripts). This is a model security posture. Only nitpick: HSTS `max-age` is 180 days vs the 12-month value in the source `_headers` file (`max-age=31536000`) — possible header-merge edge case. | sitewide | Investigate the HSTS max-age discrepancy. Source `_headers` declares 31536000 but response shows 15552000. May be a Cloudflare zone-level HSTS setting overriding the asset header. Not a security issue (180 days still qualifies for preload), but worth understanding. |
| 19 | INFO | Redirects | All 33 redirects validated working: 15 legacy SeaKing handles (e.g. `/products/seaking-b01-fillet-table` → `/products/bait-board-b01`), 7 Shopify `/pages/*` → flat routes, 4 Shopify collection consolidations, 5 system path collapses (`/cart`, `/search`, `/password`, `/account/*`, `/blogs/*`), 1 sitemap alias, 1 Shopify checkout/account prefix. Each is a single 301 hop, no chains. | n/a | No action. |
| 20 | INFO | Trailing slashes | `/products/bait-board-b01/`, `/collections/bait-boards/`, `/articles/how-to-install-a-bait-board/` all 301 to no-slash form in `worker.js` step 2. Canonical signals are consistent across `<head>`, sitemap, redirects, and internal links. | n/a | No action. |

---

## Detailed observations

### Crawlability + indexability

- `robots.txt` returns 200, 1.1 KB, correctly served from `_headers`-cached path
- 17 AI/search crawlers explicitly allowed via `User-agent: ... Allow: /` blocks; CCBot explicitly disallowed
- Sitemap declared: `Sitemap: https://baitboardsdirect.com/sitemap-index.xml`
- `sitemap-index.xml` lists one sub-sitemap (`sitemap-0.xml`) — fine for a 72-URL site
- `sitemap-0.xml` lists 72 URLs, all canonical apex, all 200 OK on spot-checks
- No `<lastmod>` in sitemap (finding #4)
- `/404` (the soft-404 page) and `/this-page-does-not-exist-12345` (real 404) both return HTTP 404 + `<meta name="robots" content="noindex, nofollow">`. No soft-404 risk.
- Homepage, PDPs, collections, articles all return HTTP 200 with `<meta name="robots" content="index, follow">`
- CF-Cache-Status: HIT on cached pages, MISS on first hit then HIT subsequently — caching layer is working
- No noindex tags on any indexable page; no x-robots-tag header in response

### Security headers

```
Strict-Transport-Security: max-age=15552000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
Content-Security-Policy: default-src 'self'; script-src 'self' [9 inline-script SHA-256 hashes] [allowlisted CDNs]; ... ; frame-ancestors 'none'; upgrade-insecure-requests;
```

The CSP is **hash-based** for inline scripts (no `unsafe-inline` on scripts) — generated by `scripts/postbuild-csp.mjs` at build time. This is the gold-standard implementation. Only gap is the missing Google Ads/DoubleClick `connect-src` origins (finding #1).

### Core Web Vitals (lab — PSI v5)

| Page | Strategy | LCP | CLS | FCP | TBT | Perf score |
|---|---|---|---|---|---|---|
| Home | mobile | **3.4 s** | 0.02 | 1.8 s | 340 ms | 83 |
| Home | desktop | 1.1 s | 0.006 | 0.4 s | 130 ms | **96** |
| PDP `/products/bait-board-b01` | mobile | **3.6 s** | 0.001 | 2.0 s | **940 ms** | 67 |
| Collection `/collections/bait-boards` | mobile | **3.9 s** | 0.001 | 1.8 s | 340 ms | 79 |

CLS is excellent everywhere (≤0.02). The wins remaining are LCP (Shopify CDN image format/weight) and TBT (third-party JS — see findings #2 and #5).

CrUX field data: `overall_category: none` — too new to have field data; expect Day-10+ to start showing real-user metrics.

INP is not yet measurable in lab data (PSI lab shows `-`) — will need to be measured from CrUX once 28 days of field data accumulate. Given the lightweight Astro islands and `client="idle"` hydration pattern, INP is likely to be well under the 200 ms "Good" threshold.

### Structured data inventory

Validated on `home`, `PDP`, `collection`, `article`, `faqs`:

| Schema | Pages | Status |
|---|---|---|
| `OnlineStore` | every page | OK |
| `Person` (Harry, founder) | every page | OK — author E-E-A-T |
| `WebSite` | every page | Has broken `SearchAction` (finding #3) |
| `BreadcrumbList` | PDP, collection, article, FAQ | OK |
| `Product` + nested `Offer` + `OfferShippingDetails` + `MerchantReturnPolicy` | PDP | OK — all required fields present (price, availability, shippingRate, returnPolicy) |
| `CollectionPage` + `ItemList` | collection | OK (ItemList is empty `mainEntity` — could be populated with product references for richer SERP) |
| `Article` | article | OK — has author, publisher, datePublished, dateModified, inLanguage |
| `FAQPage` | `/faqs` only | OK — 23 questions, comprehensive |

Notes:
- No `AggregateRating` on PDPs (intentional — per memory note, Okendo replacement pending; don't wire until client picks one)
- No `Review` schema (same reason)
- No `VideoObject` (no video content)
- No `LocalBusiness` schema, but `OnlineStore` has the `address` + `telephone` + `areaServed` which covers the local-business signals appropriately for an online-only business

### JavaScript rendering

Astro is static. All 72 URLs ship full HTML server-side. Islands:

| Component | Hydration | Pages |
|---|---|---|
| `CartIcon` | `client="idle"` | header (every page) |
| `CartDrawer` | `client="idle"` | layout (every page) |
| `AddToCartForm` | `client="load"` | PDPs only |

None of these gate first paint. Googlebot's rendering pipeline sees fully-rendered content with zero JS dependency for SEO.

### Mobile rendering

- `<meta name="viewport" content="width=device-width, initial-scale=1.0">` — correct, no `user-scalable=no` accessibility blocker
- Responsive image preloads: separate `hero-marina-mobile.webp` and `hero-marina.webp` with `media="(max-width: 767px)"` / `media="(min-width: 768px)"` — correctly conditional, only one downloads
- Hero image has `fetchpriority="high"` + `loading="eager"` + explicit width/height (no CLS)
- All `<img>` tags inspected have width/height set + alt text — no layout-shift contributors
- Touch targets in nav/buttons sized appropriately (47–48 px in inspected markup)

---

## Recommendations — prioritised action list

### This week (HIGH)

1. **Patch CSP `connect-src`** — add `https://www.google.com https://stats.g.doubleclick.net https://www.merchant-center-analytics.goog`. Single line in `public/_headers`, redeploy, verify in DevTools. **30-minute fix; blocks Google Ads ROAS measurement otherwise.**
2. **Add `&format=webp` to Shopify CDN PDP image URLs** in `ProductGallery.astro`. Expected mobile LCP drop of ~1.0–1.5 s on PDPs. **1-hour fix.**
3. **Remove or fix `WebSite` schema `SearchAction.urlTemplate`**. Cleanest option: delete the `potentialAction` block (no on-site search exists). **15-minute fix.**

### Day 2–7 (MEDIUM)

4. Add `lastmod` to sitemap via Astro sitemap integration `serialize` callback. Re-submit sitemap to GSC + Bing Webmaster.
5. Re-run PDP SEO apply script with word-boundary truncation; verify all 22 PDP titles + descriptions are non-truncated.
6. Wire IndexNow into `deploy.yml` (or confirm the portfolio deploy-layer wiring covers this repo). Publish a `public/{KEY}.txt` file.
7. Audit GTM container — move Google Ads + Microsoft Clarity behind `requestIdleCallback`; consider partytown if TBT remains >250 ms.
8. Darken `#008c9e` to `#007a8a` or `#00697a` to clear color-contrast accessibility failures.

### Day 7–30 (LOW / nice-to-have)

9. Fix "Learn more" link text on homepage.
10. Dedupe `Cache-Control` headers on `/_astro/*` immutable assets.
11. Add `favicon.ico`, `apple-touch-icon.png`, `site.webmanifest`.
12. Align Article schema `url`/`@id` with canonical (drop trailing slash).
13. Optional: lowercase pathname normalisation in `worker.js`.
14. Investigate HSTS max-age discrepancy (response shows 180 days vs source 365 days).

### Whitepaper-relevant capture

- Day-0 PSI: home mobile 83, home desktop 96, PDP mobile 67, collection mobile 79 (captured in this audit)
- Sitemap: 72 URLs, all 200, no `<lastmod>`
- Redirects: 33 wired, all validated single-hop 301
- Schema coverage: 8 schema types, all valid (1 broken SearchAction URL)
- Security score: A+ posture, single CSP gap on Ads tracking
- Lab CWV: CLS excellent (0.001–0.02), LCP needs work on mobile (3.4–3.9 s)

---

## Files referenced

- `C:\Users\micha\code\baitboards-astro\public\_headers` — CSP + cache + security headers source
- `C:\Users\micha\code\baitboards-astro\public\robots.txt` — crawler control
- `C:\Users\micha\code\baitboards-astro\worker.js` — redirect + trailing-slash handler
- `C:\Users\micha\code\baitboards-astro\redirects.js` — 33-entry redirect map
- `C:\Users\micha\code\baitboards-astro\scripts\postbuild-csp.mjs` — CSP hash pinning at build
- `C:\Users\micha\code\baitboards-astro\scripts\indexnow-ping.js` — IndexNow client (unwired)

---

*Audit completed 2026-05-20. Re-run on T+7 (Day 7) once CrUX field data starts populating; re-run again on T+30 for whitepaper Day-30 milestone comparison.*
