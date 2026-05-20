# PSI-3 + PSI-4 fix log — text-LCP element-render-delay and dark-hero clusters

**Date:** 2026-05-20 (cutover day)
**Audit referenced:** `scripts/seo/whitepaper/audit-pagespeed-2026-05-20.md`
**Pages with worst mobile LCP (pre-fix):**

| Page | Mobile LCP | Element render delay |
|------|:---:|:---:|
| `/` (home) | 8.90 s | 2.07 s |
| `/products/bait-board-b01` | 8.67 s | 1.54 s |
| `/articles` (index) | 8.56 s | 2.32 s |
| `/products/bait-board-sk-h10b` | 3.45 s | 343 ms |
| `/collections/bait-boards` | 3.00 s | 1.33 s |
| `/articles/how-to-choose-...` | 2.85 s | 1.25 s |
| `/help-me-choose` | 2.85 s | 207 ms |
| `/faqs` | 2.85 s | 1.49 s |

Two LCP cohorts: a "fast" cohort at 2.85-3.45 s and a "slow" cohort at 8.5-8.9 s. PSI-4 from the audit identified three slow pages as having "large dark-hero blocks". On inspection the cause was different: see the **Investigation** section.

---

## Investigation

### LCP element per slow page

| Page | LCP element (inferred from layout) | Font weight |
|------|---|---|
| `/` (home) | H1 inside `bg-black/40` overlay over hero slide 1 image | Montserrat 800 |
| `/products/bait-board-b01` | Gallery main image (`<img id="gallery-main">`) — preloaded 1200 w | Image |
| `/articles` (index) | H1 inside `bg-dark-hero` section | Montserrat 800 |

So PSI-4's "large dark-hero blocks" framing was directionally right for home + articles (text-LCP on a heading inside the dark-hero section). For PDP-B01 the LCP is the gallery image, which was being preloaded at 1200 w even on mobile.

### Why text-LCP was 6 s slower than FCP on home + articles index

Lighthouse 12 measures text-LCP after the **final** font swap, not after the fallback paint. With `font-display: swap` and no metric-matched fallback, Montserrat 800 swap from system fallback (Arial / Roboto / Helvetica) causes a measurable reflow because the line-box height changes. Lighthouse re-records LCP at the swap moment. On 4x CPU + 4G simulated throttling, Montserrat 800 (60-90 KB woff2) lands much later than FCP.

The "fast" cohort all have either:
- A non-Montserrat-800 element as LCP candidate (article-slug body paragraph in Archivo 400), OR
- An LCP image that arrives before the Montserrat swap.

### Render-blocking pattern audit (BaseLayout)

| Resource | Loading | Verdict |
|---|---|---|
| `/fonts/fonts.css` (2.5 KB) | external `<link rel="stylesheet">` | **blocking** — one HTTP round-trip cost on critical path |
| Tailwind CSS (~28 KB) | inlined via `astro.config.mjs` `inlineStylesheets: "always"` | already inline, not blocking external |
| All inline scripts (analytics, slideshow, mobile menu, sticky ATC, gallery thumb) | `is:inline` deferred with `requestIdleCallback` (analytics) or run-once after parse (rest) | non-blocking |
| Astro island JS chunks (CartDrawer 21 KB, CartIcon 2 KB, cart 76 KB) | `client:idle` — fired after `requestIdleCallback` post-load | non-blocking |
| Web fonts | `font-display: swap` + preloaded archivo-400 + montserrat-800 | fast but archivo-600 was missing from preload list |
| `<img>` LCP on PDP | preloaded `width=1200` even on mobile | wasted bytes on mobile |

The actionable findings:

1. `fonts.css` is fetched as a render-blocking external stylesheet for a 2.5 KB payload. Inlining it removes one critical-path round-trip (~100-300 ms saved on slow 4G).
2. Archivo 600 is heavily used in the dark-hero block (breadcrumb + supporting copy) but was not preloaded — so its woff2 lands later than the 400 + 800 weights, and any heading-supporting copy on the slow pages shifts when 600 finally arrives.
3. PDP preload was hardcoded at `width=1200` — on mobile (~390 px wide) the rendered image is downscaled, wasting ~60-90 KB of payload and stretching the resource-load duration past where it should be.
4. No metric-matched fallback face — so Lighthouse measures LCP at the post-swap reflow moment instead of at the fallback paint.
5. The `<picture>` mobile branch on home is correct (preload + source srcset agree).
6. All `@font-face` rules in `public/fonts/fonts.css` already use `font-display: swap` — no change needed there.

---

## Fixes applied

### 1. `src/layouts/BaseLayout.astro` — inline `@font-face` block + add metric-matched fallback fonts + preload Archivo 600

Before:
```html
<link rel="preload" href="/fonts/fonts.css" as="style" />
<link rel="stylesheet" href="/fonts/fonts.css" />
<link rel="preload" href="/fonts/archivo/archivo-400.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
<link rel="preload" href="/fonts/montserrat/montserrat-800.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
```

After:
```html
<link rel="preload" href="/fonts/archivo/archivo-400.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
<link rel="preload" href="/fonts/archivo/archivo-600.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
<link rel="preload" href="/fonts/montserrat/montserrat-800.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
<style>
  @font-face{font-family:'Archivo';...font-display:swap;src:url('/fonts/archivo/archivo-400.woff2')...}
  @font-face{font-family:'Archivo';font-weight:600;...}
  @font-face{font-family:'Archivo';font-weight:700;...}
  @font-face{font-family:'Montserrat';font-weight:600;...}
  @font-face{font-family:'Montserrat';font-weight:700;...}
  @font-face{font-family:'Montserrat';font-weight:800;...}
  /* Metric-matched fallback faces (Malte Ubl calibration values for Arial) */
  @font-face{font-family:'Archivo Fallback';src:local('Arial');size-adjust:99.8%;ascent-override:102.2%;descent-override:26.32%;line-gap-override:0%}
  @font-face{font-family:'Montserrat Fallback';src:local('Arial');size-adjust:96%;ascent-override:96.875%;descent-override:23.85%;line-gap-override:0%}
</style>
```

**Why:** Inlining the @font-face block removes one render-blocking external stylesheet request (eliminates ~1 RTT to the edge on every cold visit). Adding Archivo 600 to the preload list pre-warms the connection for the second-most-used woff2 file (header nav, breadcrumb copy, badges). The metric-matched fallback faces are the **load-bearing** part of this commit: when the browser paints the H1 in Arial *before* Montserrat arrives, the rendered glyph box has the same height + width characteristics as Montserrat's final glyph box, so when the swap happens there is no reflow and Lighthouse settles LCP at the fallback paint (~FCP) instead of the post-swap moment.

**File:** `src/layouts/BaseLayout.astro` lines 204-229.

### 2. `src/styles/global.css` — point `--font-body`, `--font-heading`, and direct font references to the metric-matched fallback chain

Before:
```css
--font-body:    'Archivo', sans-serif;
--font-heading: 'Montserrat', sans-serif;
/* ... */
.button-accent { font-family: "Archivo", sans-serif; }
.button        { font-family: "Archivo", sans-serif; }
.page-hero h1  { font-family: "Montserrat", sans-serif; }
.form-input    { font-family: "Archivo", sans-serif; }
```

After:
```css
--font-body:    'Archivo', 'Archivo Fallback', sans-serif;
--font-heading: 'Montserrat', 'Montserrat Fallback', sans-serif;
/* ... */
.button-accent { font-family: "Archivo", "Archivo Fallback", sans-serif; }
.button        { font-family: "Archivo", "Archivo Fallback", sans-serif; }
.page-hero h1  { font-family: "Montserrat", "Montserrat Fallback", sans-serif; }
.form-input    { font-family: "Archivo", "Archivo Fallback", sans-serif; }
```

**Why:** The fallback faces only do their job if they are in the font-family resolution chain ahead of `sans-serif`. This makes Tailwind's `font-heading` and `font-body` utilities, as well as the four hand-written component classes, all benefit from metric-matched fallback.

**File:** `src/styles/global.css` lines 18-21, 132, 156, 178, 231.

### 3. `src/pages/products/[...handle].astro` — add `preloadImageMobile` + responsive `srcset` on gallery main image

Before:
```astro
<BaseLayout ... preloadImage={shopifyImage(product.image, 1200)} ... >
<!-- ... -->
<img id="gallery-main"
     src={shopifyImage(product.image, 1200)}
     alt={product.title}
     class="..."
     width="600" height="600"
     fetchpriority="high"
     loading="eager" />
```

After:
```astro
<BaseLayout ... preloadImage={shopifyImage(product.image, 1200)}
                  preloadImageMobile={shopifyImage(product.image, 600)} ... >
<!-- ... -->
<img id="gallery-main"
     src={shopifyImage(product.image, 1200)}
     srcset={`${shopifyImage(product.image, 600)} 600w, ${shopifyImage(product.image, 1200)} 1200w`}
     sizes="(max-width: 767px) 100vw, 600px"
     alt={product.title}
     class="..."
     width="600" height="600"
     fetchpriority="high"
     loading="eager"
     decoding="async" />
```

**Why:** Before, mobile users got a 1200w image (~120 KB) preloaded *and* downloaded for a 390px viewport. Now the browser sees a `srcset`/`sizes` combination and picks the 600w variant (~40 KB) for mobile, matched by a media-scoped preload. The `decoding="async"` hint lets the browser decode the image off the main thread, which can shave 50-150 ms off the paint cost on slow CPU. Thumbnail click-to-swap still works because the click handler reads `data-src` (1200w) — by the time the user clicks, the full-size variant is cache-warm or trivially fetchable.

**File:** `src/pages/products/[...handle].astro` lines 88, 116-128.

### Files NOT changed (and why)

- `worker.js`, `wrangler.toml`, `_headers`, `redirects.js`, `scripts/seo/**` — out of scope per task constraints.
- `src/components/AnnouncementBar.astro`, `src/components/Header.astro`, `src/components/CartDrawer.svelte`, `src/components/CartIcon.svelte` — no changes; marquee, mobile menu, cart drawer, GA4/GTM/Clarity loaders all preserved exactly.
- `public/fonts/fonts.css` — left in place (still served as `/fonts/fonts.css` for any external consumer or hand-built test pages), but no longer referenced by BaseLayout. Could be deleted in a future cleanup pass.
- `scripts/critical-css.js` — not wired into `npm run build`; would require adding `critters` to package.json. Not needed because Astro's `inlineStylesheets: "always"` already inlines Tailwind in every page, and `fonts.css` is now inlined too. Critical-CSS extraction would only add value if there was a separate non-critical CSS file, which there isn't.
- `astro.config.mjs` — no changes needed; `inlineStylesheets: "always"` already does the heavy lifting.
- Tailwind `content` glob — Tailwind v4 (`@tailwindcss/vite`) auto-detects from imports; there is no glob to tighten.

---

## Build verification

```
$ npm run build
> baitboards-astro@0.0.1 build
> astro build && node scripts/postbuild-csp.mjs

15:33:38 [build] output: "static"
15:33:38 [build] mode: "static"
...
15:33:43 [build] 46 page(s) built in 5.16s
15:33:43 [build] Complete!
[postbuild-csp] pinned 9 inline script hash(es) in dist\_headers
  9 inline script hashes
```

Clean build, no errors, 46 pages, 5.16 s.

### Built-HTML spot checks

```
$ grep -oE '<link rel="(stylesheet|preload)" href="/fonts[^"]*"[^>]*>' dist/articles.html
<link rel="preload" href="/fonts/archivo/archivo-400.woff2" ...>
<link rel="preload" href="/fonts/archivo/archivo-600.woff2" ...>
<link rel="preload" href="/fonts/montserrat/montserrat-800.woff2" ...>
```
→ external `fonts.css` link removed; 3 font preloads (incl. new Archivo 600).

```
$ grep -oE '@font-face[^}]+\}' dist/articles.html | wc -l
8
```
→ 6 web @font-face + 2 fallback @font-face inlined.

```
$ grep -oE '\-\-font-(heading|body):[^;]+' dist/articles.html
--font-body:"Archivo", "Archivo Fallback", sans-serif
--font-heading:"Montserrat", "Montserrat Fallback", sans-serif
```
→ fallback chain wired into Tailwind v4 CSS variables.

```
$ grep -oE '<img[^>]*id="gallery-main"[^>]*>' dist/products/bait-board-b01.html
<img id="gallery-main"
     src=".../seaking-bait-board-b01-1.png?...&width=1200&format=webp"
     srcset=".../seaking-bait-board-b01-1.png?...&width=600&format=webp 600w,
             .../seaking-bait-board-b01-1.png?...&width=1200&format=webp 1200w"
     sizes="(max-width: 767px) 100vw, 600px"
     ... fetchpriority="high" loading="eager" decoding="async">
```
→ responsive image with mobile 600w branch.

---

## Expected impact

These are **simulated-throttling estimates** based on the Lighthouse 12 mobile profile (4x CPU, slow 4G). Real-world impact will vary; re-run PSI to confirm.

| Page | Pre LCP | Mechanism | Expected Post LCP |
|------|:---:|---|:---:|
| `/articles` (index) | 8.56 s | Was waiting for Montserrat 800 swap. Fallback face now metric-matches so LCP settles at fallback paint. | **~2.4-3.0 s** (~5.5 s improvement) |
| `/` (home) | 8.90 s | Same as above; H1 LCP candidate. Mobile hero image already preloaded correctly. | **~2.4-3.0 s** (~5.9 s improvement) |
| `/products/bait-board-b01` | 8.67 s | Image LCP. Was preloading 1200w for mobile, now preloads 600w (40 KB vs 120 KB, ~80 KB less to download on simulated 4G). | **~2.5-3.5 s** (~5.0 s improvement) |
| `/products/bait-board-sk-h10b` | 3.45 s | Same fix as B01. | **~2.0-2.5 s** (~1.0 s improvement) |
| `/collections/bait-boards` | 3.00 s | Text-LCP; benefits from fallback faces + inlined @font-face. | **~2.0-2.4 s** (~0.6 s improvement) |
| `/articles/how-to-choose-...` | 2.85 s | Same as above. | **~2.0-2.4 s** (~0.4 s improvement) |
| `/help-me-choose` | 2.85 s | Same as above. | **~2.0-2.4 s** (~0.4 s improvement) |
| `/faqs` | 2.85 s | Same as above. | **~2.0-2.4 s** (~0.4 s improvement) |

The 5+ second improvements on home + articles + PDP-B01 hinge on the metric-matched fallback fix landing as intended. If Lighthouse is still measuring LCP at the post-swap moment despite the metric match, the next iteration would either (a) tighten the fallback metrics by measuring the real Archivo/Montserrat glyph box from the actual woff2 files (vs. the calibration-sheet values), or (b) use `font-display: optional` on Montserrat 800 specifically.

### Side-effect monitoring

- **No layout shift expected**: The metric-matched fallback fonts are calibrated so the glyph box is the same height as the final Montserrat/Archivo glyph. Visual cross-checks at the actual workers.dev preview URL should confirm.
- **No functional regression expected**: Inline scripts (announcement marquee, mobile menu, hero slideshow, sticky ATC, gallery thumb swap), Astro islands (CartDrawer, CartIcon, AddToCartForm), and analytics (GA4/GTM/Clarity) are all untouched.
- **CSP compatibility**: `style-src 'self' 'unsafe-inline'` in `_headers` already permits inline `<style>` blocks, so the new inline @font-face block does not break CSP.
- **HTML payload**: increased by ~3-4 KB per page due to inlined @font-face rules. Offset by removing one render-blocking external stylesheet round-trip — net positive.

---

## Followups (out of scope for this fix, but flagged for next pass)

1. **Article slug page** has a stale `'Bricolage Grotesque', sans-serif` reference for `.article-prose h2/h3` (`src/pages/articles/[slug].astro` lines 127, 139). Font is never loaded, so it silently falls back to sans-serif. Either delete the reference or add an @font-face for it; right now H2/H3 in article bodies render in system sans-serif while the rest of the site is Montserrat/Archivo.
2. **Unused JavaScript** still the #1 PSI opportunity at 304 KiB / page (audit § 4 rank 1). Not addressed here because it requires deeper Astro island analysis (which components really need `client:load` vs `client:idle` vs `client:visible`).
3. **Image delivery** rank 2 in the audit: shark logo + footer logo still oversized. Not in scope for this fix.
4. **Hero slide 2 image** on home (`/images/hero-2.webp`, 84 KB) is lazy-loaded via `data-src` swap on first activation — good — but the slideshow auto-rotation kicks in at 6 s, which is well after LCP measurement. No change needed.
