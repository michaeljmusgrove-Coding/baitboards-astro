# Bait Boards Direct — PageSpeed Insights POST-CUTOVER Audit

**Captured:** 2026-05-20 (cutover day)
**Site:** baitboardsdirect.com (Cloudflare Workers + Astro 4 — new architecture)
**Tool:** Google PageSpeed Insights API v5 (Lighthouse 12, lab data; CrUX field data where available)
**Purpose:** Post-cutover snapshot for whitepaper, paired with pre-cutover baseline (`pre-launch-baseline/pagespeed/PSI-PRE-CUTOVER-2026-05-18.md`).

Thresholds — LCP good ≤2.5s / poor >4.0s · INP good ≤200ms / poor >500ms · CLS good ≤0.1 / poor >0.25 · Perf score good ≥90 / poor <50.

---

## 1. Per-page summary table

### Mobile (Google's primary index)

| Page | URL | Perf | LCP | INP (lab) | CLS | TTFB | FCP | TBT |
|------|-----|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Homepage** | `/` | **66** 🟠 | 8.90 s 🔴 | n/a | 0.000 🟢 | 3 ms | 2.40 s | 240 ms |
| **PDP — B01 (top seller)** | `/products/bait-board-b01` | **60** 🟠 | 8.67 s 🔴 | n/a | 0.000 🟢 | 4 ms | 1.95 s | 434 ms |
| **PDP — SK-H10B (larger)** | `/products/bait-board-sk-h10b` | **81** 🟠 | 3.45 s 🟠 | n/a | 0.001 🟢 | 3 ms | 1.80 s | 368 ms |
| **Collection — Bait Boards** | `/collections/bait-boards` | **81** 🟠 | 3.00 s 🟠 | n/a | 0.001 🟢 | 2 ms | 1.80 s | 496 ms |
| **Articles index** | `/articles` | **67** 🟠 | 8.56 s 🔴 | n/a | 0.000 🟢 | 3 ms | 2.40 s | 191 ms |
| **Article — how to choose** | `/articles/how-to-choose-a-bait-board-for-your-boat` | **88** 🟠 | 2.85 s 🟠 | n/a | 0.001 🟢 | 3 ms | 1.80 s | 296 ms |
| **Quiz — Help Me Choose** | `/help-me-choose` | **91** 🟢 | 2.85 s 🟠 | n/a | 0.001 🟢 | 4 ms | 1.80 s | 226 ms |
| **FAQs** | `/faqs` | **85** 🟠 | 2.85 s 🟠 | n/a | 0.001 🟢 | 5 ms | 1.80 s | 367 ms |

### Desktop

| Page | URL | Perf | LCP | INP (lab) | CLS | TTFB | FCP | TBT |
|------|-----|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Homepage** | `/` | **88** 🟠 | 1.02 s 🟢 | n/a | 0.000 🟢 | 4 ms | 401 ms | 263 ms |
| **PDP — B01 (top seller)** | `/products/bait-board-b01` | **95** 🟢 | 702 ms 🟢 | n/a | 0.002 🟢 | 3 ms | 402 ms | 176 ms |
| **PDP — SK-H10B (larger)** | `/products/bait-board-sk-h10b` | **75** 🟠 | 762 ms 🟢 | n/a | 0.002 🟢 | 10 ms | 422 ms | 645 ms |
| **Collection — Bait Boards** | `/collections/bait-boards` | **78** 🟠 | 681 ms 🟢 | n/a | 0.002 🟢 | 3 ms | 401 ms | 506 ms |
| **Articles index** | `/articles` | **98** 🟢 | 641 ms 🟢 | n/a | 0.002 🟢 | 2 ms | 401 ms | 127 ms |
| **Article — how to choose** | `/articles/how-to-choose-a-bait-board-for-your-boat` | **80** 🟠 | 641 ms 🟢 | n/a | 0.002 🟢 | 4 ms | 401 ms | 458 ms |
| **Quiz — Help Me Choose** | `/help-me-choose` | **84** 🟠 | 642 ms 🟢 | n/a | 0.000 🟢 | 4 ms | 402 ms | 373 ms |
| **FAQs** | `/faqs` | **80** 🟠 | 641 ms 🟢 | n/a | 0.002 🟢 | 7 ms | 401 ms | 444 ms |

> **INP (lab):** Lighthouse 12 no longer emits a lab-INP value on PSI runs — field INP is the authoritative signal, and CrUX has not yet accumulated enough Chrome traffic on baitboardsdirect.com for an INP p75. Re-pull CrUX at T+30/T+60/T+90.

### Mobile LCP breakdown (subparts, from `lcp-breakdown-insight`)

| Page | TTFB | Resource load delay | Resource load duration | Element render delay | Total LCP |
|------|:---:|:---:|:---:|:---:|:---:|
| **Homepage** | 1 ms | 135 ms | 75 ms | 2.07 s | 8.90 s |
| **PDP — B01 (top seller)** | 1 ms | 364 ms | 607 ms | 1.54 s | 8.67 s |
| **PDP — SK-H10B (larger)** | 5 ms | 356 ms | 59 ms | 343 ms | 3.45 s |
| **Collection — Bait Boards** | 1 ms | — | — | 1.33 s | 3.00 s |
| **Articles index** | 1 ms | — | — | 2.32 s | 8.56 s |
| **Article — how to choose** | 1 ms | — | — | 1.25 s | 2.85 s |
| **Quiz — Help Me Choose** | 1 ms | — | — | 207 ms | 2.85 s |
| **FAQs** | 1 ms | — | — | 1.49 s | 2.85 s |

**Reading this:**

- TTFB is essentially zero (<5ms) on every page — Cloudflare edge cache is doing its job perfectly. Network is not the bottleneck.
- **Subparts vs total LCP do not sum:** subparts are raw timings from the trace, total LCP is post-throttling-adjusted (Lighthouse 12 simulated-throttling quirk). The subpart *ratios* are still diagnostic: where the time is going.
- **Element render delay dominates** on every text-LCP page (articles, collection, FAQs, quiz). Render delay is the gap between resource availability and paint — almost always render-blocking CSS/JS or main-thread contention during hydration.
- **Two mobile-LCP cohorts emerge:** pages clustering at 2.85-3.45s LCP (FCP ~1.8s) vs pages at 8.5-8.9s LCP (FCP ~2.0-2.4s). The 600ms FCP delay on home/PDP-B01/articles-index almost certainly traces to large hero blocks (dark-hero section + hero image) that delay the first paint, then push LCP back even further. Optimising the hero block (smaller mobile image, simpler dark overlay, no-JS hero rendering) should compress those three pages back into the sub-3.5s cohort.

---

## 2. Delta vs pre-cutover (2026-05-18)

Pre-cutover values from `pre-launch-baseline/pagespeed/PSI-PRE-CUTOVER-2026-05-18.md` (live Shopify theme). Only home/PDP-h10b/collection are directly comparable — the other 5 pages did not exist in the pre-cutover capture set.

### Mobile

| Page | Pre Perf | Post Perf | Δ Perf | Pre LCP | Post LCP | Δ LCP | Pre TBT | Post TBT | Δ TBT |
|------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Homepage** | 44 | 66 | **+22** | 13.0 s | 8.90 s | **-4.10 s** | 830 ms | 240 ms | **-590 ms** |
| **PDP — SK-H10B (larger)** | 48 | 81 | **+33** | 4.5 s | 3.45 s | **-1.05 s** | 1200 ms | 368 ms | **-832 ms** |
| **Collection — Bait Boards** | 54 | 81 | **+27** | 3.9 s | 3.00 s | **-0.90 s** | 1270 ms | 496 ms | **-774 ms** |

### Desktop

| Page | Pre Perf | Post Perf | Δ Perf | Pre LCP | Post LCP | Δ LCP | Pre TBT | Post TBT | Δ TBT |
|------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Homepage** | 64 | 88 | **+24** | 1.6 s | 1.02 s | **-0.58 s** | 540 ms | 263 ms | **-277 ms** |
| **PDP — SK-H10B (larger)** | 68 | 75 | **+7** | 1.5 s | 0.76 s | **-0.74 s** | 540 ms | 645 ms | **+105 ms** |
| **Collection — Bait Boards** | 66 | 78 | **+12** | 1.1 s | 0.68 s | **-0.42 s** | 970 ms | 506 ms | **-464 ms** |

---

## 3. CrUX field data (real-user, 28-day rolling)

**Result: no CrUX field data available.** PageSpeed Insights returns an empty `loadingExperience` for every URL on this origin and an empty `originLoadingExperience` overall. baitboardsdirect.com does not yet meet the CrUX minimum-traffic threshold for inclusion in the public Chrome User Experience Report dataset (estimated ~25k unique Chrome visits / 28-day window).

**Implication:** field-data validation will need to come from Cloudflare Web Analytics or a real-user-monitoring beacon (web-vitals.js) rather than CrUX. Lab data (above) is the only public signal available pre-traffic-accrual.

**Action:** instrument the Cloudflare Web Analytics RUM endpoint on the Astro build (or add a lightweight `web-vitals.js` beacon to a Workers KV bucket) so post-cutover field data is captured natively, independent of CrUX inclusion.

---

## 4. Consolidated opportunities (ranked by impact)

Aggregated across all 8 pages × 2 strategies (16 runs). Core-metric audits excluded. Ranked by Σ savings (ms) then Σ savings (KiB) then frequency.

| Rank | Audit | Affected | Σ savings (ms) | Σ savings (KiB) | Worst case |
|---|---|:---:|:---:|:---:|:---|
| 1 | **Reduce unused JavaScript** (`unused-javascript`) | 16/16 | 4840 | 4629 | 1650ms / 304KiB |
| 2 | **Improve image delivery** (`image-delivery-insight`) | 16/16 | 0 | 1288 | 230KiB |
| 3 | **Use efficient cache lifetimes** (`cache-insight`) | 16/16 | 0 | 74 | 5KiB |
| 4 | **Network dependency tree** (`network-dependency-tree-insight`) | 16/16 | 0 | 0 | — |
| 5 | **Forced reflow** (`forced-reflow-insight`) | 6/16 | 0 | 0 | — |
| 6 | **LCP breakdown** (`lcp-breakdown-insight`) | 1/16 | 0 | 0 | — |

### Prioritised fix list

Based on the ranking above and the LCP-subpart breakdown, the four highest-leverage fixes are:

1. **Reduce unused JavaScript (~304 KiB / page, 16/16 affected)** — the single biggest gap. Astro's default island bundle is shipping framework code that isn't being used on every route. Audit `_astro/*.js` chunks: split per-route hydration, add `client:visible` or `client:idle` to non-critical islands, and consider a `client:only` boundary for components that only render below the fold.
2. **Improve image delivery (~133 KiB / page, oversized hero & logo on mobile)** — `shark-logo.webp` is shipped at 2541×670 but displayed at 265×70 in the footer; product PDPs ship 790×870 for a 637×702 display. Generate responsive `<source srcset>` sets via Astro's `getImage()` or `<picture>` with width descriptors; consider preprocessing all `/images/*` assets through `astro:assets` to auto-generate AVIF + width variants. Target: cut hero/logo payload by 50-70%.
3. **Eliminate large element-render-delay on mobile** (1.2-2.3s on articles/collection/FAQs/quiz) — TTFB is <5ms, resource load is fast, so the LCP cost is the gap between resource availability and paint. Likely culprits: render-blocking CSS, JS hydration churn during load, or web-font FOIT. Action: audit `<head>` for render-blocking sheets; ensure critical CSS is inlined for hero blocks; defer non-critical CSS (`<link rel='preload' as='style' onload>`); confirm fonts use `font-display: swap` and are preloaded; consider splitting CSS by route via Astro's CSS scoping.
4. **Set explicit width/height on remaining `<img>` tags (unsized-images, 7+ images on home)** — currently CLS is 0.000–0.002 so this isn't biting yet, but every unsized image is a future CLS regression. Astro `<Image>` component handles this; raw `<img>` tags do not. Pass: confirm all components use `<Image>` not `<img>`.

---

## 5. Per-page top opportunities

### Homepage — `/`

**mobile** — Perf 66 / LCP 8.90 s 🔴 / CLS 0.000 🟢 / TBT 240 ms / TTFB 3 ms

Top opportunities (Lighthouse 12 insight-style):
- **Reduce unused JavaScript** (save 1500 ms, save 304 KiB)
- **Improve image delivery** (save 133 KiB)
- **Use efficient cache lifetimes** (save 5 KiB)
- **Network dependency tree**

**desktop** — Perf 88 / LCP 1.02 s 🟢 / CLS 0.000 🟢 / TBT 263 ms / TTFB 4 ms

Top opportunities (Lighthouse 12 insight-style):
- **Reduce unused JavaScript** (save 40 ms, save 304 KiB)
- **Improve image delivery** (save 230 KiB)
- **Use efficient cache lifetimes** (save 5 KiB)
- **Network dependency tree**


### PDP — B01 (top seller) — `/products/bait-board-b01`

**mobile** — Perf 60 / LCP 8.67 s 🔴 / CLS 0.000 🟢 / TBT 434 ms / TTFB 4 ms

Top opportunities (Lighthouse 12 insight-style):
- **Reduce unused JavaScript** (save 1650 ms, save 304 KiB)
- **Improve image delivery** (save 79 KiB)
- **Use efficient cache lifetimes** (save 5 KiB)
- **Forced reflow**
- **LCP breakdown**

**desktop** — Perf 95 / LCP 702 ms 🟢 / CLS 0.002 🟢 / TBT 176 ms / TTFB 3 ms

Top opportunities (Lighthouse 12 insight-style):
- **Reduce unused JavaScript** (save 188 KiB)
- **Improve image delivery** (save 64 KiB)
- **Use efficient cache lifetimes** (save 5 KiB)
- **Network dependency tree**


### PDP — SK-H10B (larger) — `/products/bait-board-sk-h10b`

**mobile** — Perf 81 / LCP 3.45 s 🟠 / CLS 0.001 🟢 / TBT 368 ms / TTFB 3 ms

Top opportunities (Lighthouse 12 insight-style):
- **Reduce unused JavaScript** (save 303 KiB)
- **Improve image delivery** (save 64 KiB)
- **Use efficient cache lifetimes** (save 5 KiB)
- **Network dependency tree**

**desktop** — Perf 75 / LCP 762 ms 🟢 / CLS 0.002 🟢 / TBT 645 ms / TTFB 10 ms

Top opportunities (Lighthouse 12 insight-style):
- **Reduce unused JavaScript** (save 304 KiB)
- **Improve image delivery** (save 75 KiB)
- **Use efficient cache lifetimes** (save 5 KiB)
- **Forced reflow**
- **Network dependency tree**


### Collection — Bait Boards — `/collections/bait-boards`

**mobile** — Perf 81 / LCP 3.00 s 🟠 / CLS 0.001 🟢 / TBT 496 ms / TTFB 2 ms

Top opportunities (Lighthouse 12 insight-style):
- **Reduce unused JavaScript** (save 304 KiB)
- **Improve image delivery** (save 64 KiB)
- **Use efficient cache lifetimes** (save 5 KiB)
- **Network dependency tree**

**desktop** — Perf 78 / LCP 681 ms 🟢 / CLS 0.002 🟢 / TBT 506 ms / TTFB 3 ms

Top opportunities (Lighthouse 12 insight-style):
- **Reduce unused JavaScript** (save 188 KiB)
- **Improve image delivery** (save 64 KiB)
- **Use efficient cache lifetimes** (save 5 KiB)
- **Forced reflow**
- **Network dependency tree**


### Articles index — `/articles`

**mobile** — Perf 67 / LCP 8.56 s 🔴 / CLS 0.000 🟢 / TBT 191 ms / TTFB 3 ms

Top opportunities (Lighthouse 12 insight-style):
- **Reduce unused JavaScript** (save 1650 ms, save 304 KiB)
- **Improve image delivery** (save 64 KiB)
- **Use efficient cache lifetimes** (save 5 KiB)
- **Network dependency tree**

**desktop** — Perf 98 / LCP 641 ms 🟢 / CLS 0.002 🟢 / TBT 127 ms / TTFB 2 ms

Top opportunities (Lighthouse 12 insight-style):
- **Reduce unused JavaScript** (save 303 KiB)
- **Improve image delivery** (save 64 KiB)
- **Use efficient cache lifetimes** (save 5 KiB)
- **Network dependency tree**


### Article — how to choose — `/articles/how-to-choose-a-bait-board-for-your-boat`

**mobile** — Perf 88 / LCP 2.85 s 🟠 / CLS 0.001 🟢 / TBT 296 ms / TTFB 3 ms

Top opportunities (Lighthouse 12 insight-style):
- **Reduce unused JavaScript** (save 303 KiB)
- **Improve image delivery** (save 64 KiB)
- **Use efficient cache lifetimes** (save 5 KiB)
- **Network dependency tree**

**desktop** — Perf 80 / LCP 641 ms 🟢 / CLS 0.002 🟢 / TBT 458 ms / TTFB 4 ms

Top opportunities (Lighthouse 12 insight-style):
- **Reduce unused JavaScript** (save 304 KiB)
- **Improve image delivery** (save 64 KiB)
- **Use efficient cache lifetimes** (save 5 KiB)
- **Forced reflow**
- **Network dependency tree**


### Quiz — Help Me Choose — `/help-me-choose`

**mobile** — Perf 91 / LCP 2.85 s 🟠 / CLS 0.001 🟢 / TBT 226 ms / TTFB 4 ms

Top opportunities (Lighthouse 12 insight-style):
- **Reduce unused JavaScript** (save 304 KiB)
- **Improve image delivery** (save 64 KiB)
- **Use efficient cache lifetimes** (save 5 KiB)
- **Network dependency tree**

**desktop** — Perf 84 / LCP 642 ms 🟢 / CLS 0.000 🟢 / TBT 373 ms / TTFB 4 ms

Top opportunities (Lighthouse 12 insight-style):
- **Reduce unused JavaScript** (save 304 KiB)
- **Improve image delivery** (save 64 KiB)
- **Use efficient cache lifetimes** (save 5 KiB)
- **Forced reflow**
- **Network dependency tree**


### FAQs — `/faqs`

**mobile** — Perf 85 / LCP 2.85 s 🟠 / CLS 0.001 🟢 / TBT 367 ms / TTFB 5 ms

Top opportunities (Lighthouse 12 insight-style):
- **Reduce unused JavaScript** (save 304 KiB)
- **Improve image delivery** (save 64 KiB)
- **Use efficient cache lifetimes** (save 5 KiB)
- **Network dependency tree**

**desktop** — Perf 80 / LCP 641 ms 🟢 / CLS 0.002 🟢 / TBT 444 ms / TTFB 7 ms

Top opportunities (Lighthouse 12 insight-style):
- **Reduce unused JavaScript** (save 303 KiB)
- **Improve image delivery** (save 64 KiB)
- **Use efficient cache lifetimes** (save 5 KiB)
- **Forced reflow**
- **Network dependency tree**


---

## 6. Method notes

- Tool: Google PageSpeed Insights API v5 (`/pagespeedonline/v5/runPagespeed`)
- Lighthouse version: 12 (Lighthouse 12+ replaced legacy "opportunity" audits with "insight" audits; this parser handles both)
- Lab data: simulated throttling, single run per URL × strategy (PSI default)
- Field data: CrUX 28-day rolling — currently empty for baitboardsdirect.com (below CrUX inclusion threshold)
- INP (lab): not emitted by Lighthouse 12 on PSI default config; field INP from CrUX or RUM is the authoritative signal
- Raw JSON: all 16 runs saved to `C:/Users/micha/AppData/Local/Temp/psi-bbd/*.json`; copy to `pre-launch-baseline/pagespeed/post-cutover/` for archival
