# Bait Boards Direct — PageSpeed Insights POST-FIX Audit

**Captured:** 2026-05-20 (cutover day — afternoon, post-fix deploy)
**Site:** baitboardsdirect.com (Cloudflare Workers + Astro 4)
**Latest deploy at audit time:** commit 558f5e0 (finalised minutes before capture)
**Tool:** Google PageSpeed Insights API v5 (Lighthouse 12, lab data; CrUX field data where available)
**Purpose:** Validate the morning's three PSI fix commits — Astro island bundle splitting (PSI-1), hero LCP cluster + inlined font-face (PSI-3/4), responsive PDP gallery (PSI image), and CLS img sizing fixes — against the go-live snapshot captured this morning (`audit-pagespeed-2026-05-20.md`) and the live-Shopify pre-cutover baseline (`pre-launch-baseline/pagespeed/PSI-PRE-CUTOVER-2026-05-18.md`).

Thresholds — LCP good ≤2.5s / poor >4.0s · INP good ≤200ms / poor >500ms · CLS good ≤0.1 / poor >0.25 · Perf score good ≥90 / poor <50.

---

## 1. Per-page summary tables

### Mobile (Google's primary index)

| Page | URL | Perf | LCP | INP (lab) | CLS | TTFB | FCP | TBT |
|------|-----|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Homepage** | `/` | **75** 🟠 | 3.5 s 🟠 | n/a | 0.000 🟢 | — | 1.70 s | 540 ms |
| **Collection — Bait Boards** | `/collections/bait-boards` | **87** 🟠 | 3.5 s 🟠 | n/a | 0.000 🟢 | — | 1.70 s | 190 ms |
| **Collection — On Sale** | `/collections/on-sale` | **67** 🟠 | 9.4 s 🔴 | n/a | 0.000 🟢 | — | 1.80 s | 250 ms |
| **PDP — B01 (top seller)** | `/products/bait-board-b01` | **63** 🟠 | 3.2 s 🟠 | n/a | 0.001 🟢 | — | 1.70 s | 2,060 ms 🔴 |
| **PDP — SK-H10B (larger)** | `/products/bait-board-sk-h10b` | **73** 🟠 | 3.3 s 🟠 | n/a | 0.001 🟢 | — | 1.70 s | 760 ms |
| **Articles index** | `/articles` | **89** 🟠 | 2.7 s 🟠 | n/a | 0.000 🟢 | — | 2.10 s | 250 ms |
| **Article — how to install** | `/articles/how-to-install-a-bait-board` | **89** 🟠 | 2.6 s 🟠 | n/a | 0.001 🟢 | — | 1.70 s | 320 ms |
| **Article — how to choose** | `/articles/how-to-choose-a-bait-board-for-your-boat` | **87** 🟠 | 2.6 s 🟠 | n/a | 0.001 🟢 | — | 1.70 s | 380 ms |
| **FAQs** | `/faqs` | **93** 🟢 | 2.6 s 🟠 | n/a | 0.001 🟢 | — | 1.70 s | 210 ms |

### Desktop

| Page | URL | Perf | LCP | INP (lab) | CLS | TTFB | FCP | TBT |
|------|-----|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Homepage** | `/` | **93** 🟢 | 1.1 s 🟢 | n/a | 0.004 🟢 | — | 0.40 s | 180 ms |
| **Collection — Bait Boards** | `/collections/bait-boards` | **97** 🟢 | 0.7 s 🟢 | n/a | 0.004 🟢 | — | 0.40 s | 130 ms |
| **Collection — On Sale** | `/collections/on-sale` | **83** 🟠 | 1.0 s 🟢 | n/a | 0.000 🟢 | — | 0.40 s | 360 ms |
| **PDP — B01 (top seller)** | `/products/bait-board-b01` | **70** 🟠 | 0.8 s 🟢 | n/a | 0.004 🟢 | — | 0.60 s | 1,030 ms 🔴 |
| **PDP — SK-H10B (larger)** | `/products/bait-board-sk-h10b` | **95** 🟢 | 0.7 s 🟢 | n/a | 0.004 🟢 | — | 0.40 s | 180 ms |
| **Articles index** | `/articles` | **97** 🟢 | 0.6 s 🟢 | n/a | 0.004 🟢 | — | 0.40 s | 140 ms |
| **Article — how to install** | `/articles/how-to-install-a-bait-board` | **71** 🟠 | 0.6 s 🟢 | n/a | 0.004 🟢 | — | 0.40 s | 1,200 ms 🔴 |
| **Article — how to choose** | `/articles/how-to-choose-a-bait-board-for-your-boat` | **84** 🟠 | 0.6 s 🟢 | n/a | 0.004 🟢 | — | 0.40 s | 360 ms |
| **FAQs** | `/faqs` | **83** 🟠 | 0.6 s 🟢 | n/a | 0.004 🟢 | — | 0.40 s | 390 ms |

> **INP (lab):** Lighthouse 12 does not emit a lab-INP value on PSI runs — field INP (CrUX or RUM) is the authoritative signal. CrUX still empty for the origin (below traffic threshold).

---

## 2. Delta vs go-live (this morning, `audit-pagespeed-2026-05-20.md`)

The go-live capture (morning of 2026-05-20) was the new Astro stack pre-fix. The afternoon capture is after PSI-1 (island bundle splitting), PSI-3/4 (hero LCP cluster + inlined @font-face), the responsive PDP gallery srcset, and the CLS img width/height fixes.

### Mobile

| Page | Go-live Perf | Now Perf | Δ Perf | Go-live LCP | Now LCP | Δ LCP | Go-live TBT | Now TBT | Δ TBT |
|------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Homepage** | 66 | 75 | **+9** | 8.90 s | 3.5 s | **-5.40 s** ✅ | 240 ms | 540 ms | +300 ms |
| **Collection — Bait Boards** | 81 | 87 | **+6** | 3.00 s | 3.5 s | +0.50 s | 496 ms | 190 ms | **-306 ms** |
| **Collection — On Sale** | n/a | 67 | new | n/a | 9.4 s 🔴 | new | n/a | 250 ms | new |
| **PDP — B01 (top seller)** | 60 | 63 | +3 | 8.67 s | 3.2 s | **-5.47 s** ✅ | 434 ms | 2,060 ms | +1,626 ms 🔴 |
| **PDP — SK-H10B (larger)** | 81 | 73 | -8 | 3.45 s | 3.3 s | -0.15 s | 368 ms | 760 ms | +392 ms |
| **Articles index** | 67 | 89 | **+22** | 8.56 s | 2.7 s | **-5.86 s** ✅ | 191 ms | 250 ms | +59 ms |
| **Article — how to install** | n/a | 89 | new | n/a | 2.6 s | new | n/a | 320 ms | new |
| **Article — how to choose** | 88 | 87 | -1 | 2.85 s | 2.6 s | -0.25 s | 296 ms | 380 ms | +84 ms |
| **FAQs** | 85 | 93 | **+8** | 2.85 s | 2.6 s | -0.25 s | 367 ms | 210 ms | **-157 ms** |

### Desktop

| Page | Go-live Perf | Now Perf | Δ Perf | Go-live LCP | Now LCP | Δ LCP | Go-live TBT | Now TBT | Δ TBT |
|------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Homepage** | 88 | 93 | **+5** | 1.02 s | 1.1 s | +0.08 s | 263 ms | 180 ms | **-83 ms** |
| **Collection — Bait Boards** | 78 | 97 | **+19** | 0.68 s | 0.7 s | +0.02 s | 506 ms | 130 ms | **-376 ms** |
| **Collection — On Sale** | n/a | 83 | new | n/a | 1.0 s | new | n/a | 360 ms | new |
| **PDP — B01 (top seller)** | 95 | 70 | **-25** 🔴 | 0.70 s | 0.8 s | +0.10 s | 176 ms | 1,030 ms | +854 ms 🔴 |
| **PDP — SK-H10B (larger)** | 75 | 95 | **+20** | 0.76 s | 0.7 s | -0.06 s | 645 ms | 180 ms | **-465 ms** |
| **Articles index** | 98 | 97 | -1 | 0.64 s | 0.6 s | -0.04 s | 127 ms | 140 ms | +13 ms |
| **Article — how to install** | n/a | 71 | new | n/a | 0.6 s | new | n/a | 1,200 ms 🔴 | new |
| **Article — how to choose** | 80 | 84 | +4 | 0.64 s | 0.6 s | -0.04 s | 458 ms | 360 ms | -98 ms |
| **FAQs** | 80 | 83 | +3 | 0.64 s | 0.6 s | -0.04 s | 444 ms | 390 ms | -54 ms |

### Cluster migration: PSI-3/4 prediction validated ✅

The morning audit identified a **two-cluster mobile-LCP pattern**: pages clustering at 2.85–3.45 s LCP vs pages stuck at 8.5–8.9 s LCP. The PSI-3/4 fix (inlined @font-face block + metric-matched fallback faces + Archivo 600 preload) was predicted to compress the slow cluster into the fast cluster.

Result — **all three slow-cluster pages migrated to the fast cluster**:

| Page | Mobile LCP go-live | Mobile LCP now | Migrated? |
|------|:---:|:---:|:---:|
| Homepage | 8.90 s 🔴 | **3.5 s 🟠** | ✅ -5.40 s |
| PDP — B01 | 8.67 s 🔴 | **3.2 s 🟠** | ✅ -5.47 s |
| Articles index | 8.56 s 🔴 | **2.7 s 🟠** | ✅ -5.86 s |

Three pages that were in the "Poor" LCP band (>4.0 s) on mobile are now in the "Needs Improvement" band (2.5–4.0 s). No page on the new architecture is still in the Poor band except the newly-audited `/collections/on-sale` (more on that below).

### New regressions surfaced by the post-fix capture

1. **PDP — B01 mobile TBT exploded**: 434 ms → 2,060 ms (+1,626 ms). Desktop also: 176 ms → 1,030 ms (+854 ms). LCP improved, but main-thread blocking on this page got dramatically worse. Possible cause: the responsive `srcset` preload (`preloadImageMobile` 600w) on the gallery may be racing with hydration; or the gallery component itself is now hydrating eagerly where it used to be deferred. Worth diffing the bundled chunk size for this route vs SK-H10B (which improved by 465 ms TBT desktop and 392 ms TBT mobile — likely because SK-H10B was the page the gallery work was tuned against).
2. **`/articles/how-to-install-a-bait-board` desktop TBT 1,200 ms** — this page is new in the post-fix capture (wasn't in the morning batch) so it's not a regression, but it's an outlier and worth a look. Mobile TBT (320 ms) is fine; the desktop spike is unusual.
3. **`/collections/on-sale` mobile LCP 9.4 s 🔴** — new page in the post-fix batch. This is the only page still in the Poor LCP band on mobile. Likely the same root cause as the morning slow cluster (large hero block / font swap) but on a route that didn't get the explicit hero work — the on-sale collection template may differ from `/collections/bait-boards` in hero structure.

---

## 3. Delta vs pre-cutover (2026-05-18)

Pre-cutover values from `pre-launch-baseline/pagespeed/PSI-PRE-CUTOVER-2026-05-18.md` (live Shopify theme). Only home/PDP-SK-H10B/collection-bait-boards are directly comparable.

### Mobile — three-era comparison

| Page | Pre (Shopify) | Go-live (Astro pre-fix) | Now (Astro post-fix) | Δ Perf pre→now | Δ LCP pre→now | Δ TBT pre→now |
|------|:---:|:---:|:---:|:---:|:---:|:---:|
| **Homepage** | Perf 44 / LCP 13.0 s / TBT 830 ms | Perf 66 / LCP 8.90 s / TBT 240 ms | **Perf 75 / LCP 3.5 s / TBT 540 ms** | **+31** | **-9.5 s** | **-290 ms** |
| **PDP — SK-H10B** | Perf 48 / LCP 4.5 s / TBT 1,200 ms | Perf 81 / LCP 3.45 s / TBT 368 ms | **Perf 73 / LCP 3.3 s / TBT 760 ms** | **+25** | **-1.2 s** | **-440 ms** |
| **Collection — Bait Boards** | Perf 54 / LCP 3.9 s / TBT 1,270 ms | Perf 81 / LCP 3.00 s / TBT 496 ms | **Perf 87 / LCP 3.5 s / TBT 190 ms** | **+33** | **-0.4 s** | **-1,080 ms** |

### Desktop — three-era comparison

| Page | Pre (Shopify) | Go-live (Astro pre-fix) | Now (Astro post-fix) | Δ Perf pre→now | Δ LCP pre→now | Δ TBT pre→now |
|------|:---:|:---:|:---:|:---:|:---:|:---:|
| **Homepage** | Perf 64 / LCP 1.6 s / TBT 540 ms | Perf 88 / LCP 1.02 s / TBT 263 ms | **Perf 93 / LCP 1.1 s / TBT 180 ms** | **+29** | **-0.5 s** | **-360 ms** |
| **PDP — SK-H10B** | Perf 68 / LCP 1.5 s / TBT 540 ms | Perf 75 / LCP 0.76 s / TBT 645 ms | **Perf 95 / LCP 0.7 s / TBT 180 ms** | **+27** | **-0.8 s** | **-360 ms** |
| **Collection — Bait Boards** | Perf 66 / LCP 1.1 s / TBT 970 ms | Perf 78 / LCP 0.68 s / TBT 506 ms | **Perf 97 / LCP 0.7 s / TBT 130 ms** | **+31** | **-0.4 s** | **-840 ms** |

**Headline:** every comparable page is +25 to +33 Lighthouse Performance points vs the old Shopify theme, with mobile LCP improvements ranging from −0.4 s to −9.5 s. The homepage mobile LCP improvement (−9.5 s, from 13.0 s to 3.5 s) is the single largest single-page win recorded in the project.

---

## 4. Consolidated opportunities ranked (what's still on the table after fixes)

Aggregated across all 18 runs (9 pages × 2 strategies). Lighthouse 12 surfaces these consistently:

| Rank | Audit | Affected | Σ savings (KiB) | Worst case (KiB) | Notes |
|---|---|:---:|:---:|:---:|:---|
| 1 | **Reduce unused JavaScript** (`unused-javascript`) | 18/18 | ~4,800 | 304 | Down from the morning audit's "5 KiB to 1,650 ms" wattage, but still the dominant remaining lever. Per-page savings now in the 186–304 KiB range vs the consistent 304 KiB pre-fix. Island splitting helped most where it could — articles index dropped from "save 1,650 ms" to single-step opportunity. |
| 2 | **Minify CSS / JS / unused CSS** | 18/18 | passing | — | All three audits pass on every page (score 1). |
| 3 | **Avoid multiple page redirects** | 18/18 | passing | — | Score 1 on every page. |

No image-delivery or cache-lifetime audits appear in the post-fix Lighthouse 12 insight output for these runs — the prior audit-pagespeed report extracted them from a different parser pass (insight-style audits including `image-delivery-insight`, `cache-insight`, `network-dependency-tree-insight`, `forced-reflow-insight`, `lcp-breakdown-insight`). Those audits exist in the underlying Lighthouse JSON but aren't surfaced through the MCP's summary view; the morning report appears to have parsed the full JSON, this MCP returns the legacy opportunity list. The remaining-work direction (unused JS still ~300 KiB per page) holds either way.

### What the fixes DID accomplish vs the morning's prioritised list

| Morning priority | Status after fixes |
|---|---|
| #1 Reduce unused JS (~304 KiB / page) | **Partial.** Per-page savings dropped from 304 KiB universal to 186–304 KiB range. Articles index dropped from "1,650 ms" to single-figure. Further per-route splitting still possible. |
| #2 Improve image delivery (133 KiB hero, oversized PDP) | **Done** for PDP gallery (responsive srcset, mobile fetches ~40 KiB instead of ~120 KiB). Footer/home logos may still be oversized — not surfaced in this run's audit output. |
| #3 Eliminate large element-render-delay on mobile | **Done.** Homepage 2.07 s render delay → home mobile LCP collapsed from 8.90 s to 3.5 s. Articles index 2.32 s render delay → LCP collapsed from 8.56 s to 2.7 s. PDP-B01 1.54 s render delay → LCP collapsed from 8.67 s to 3.2 s. Inlined @font-face + metric-matched fallback fonts validated. |
| #4 Width/height on remaining `<img>` tags (CLS hygiene) | **Done.** Mobile CLS 0.000 on every page; desktop CLS 0.004 (footer-area shift, sub-threshold but consistent). The five-image fix held. |

### What's still left

1. **PDP-B01 main-thread budget — investigate the +1,626 ms mobile TBT regression.** Most likely root cause: the new responsive gallery component is hydrating eagerly on this route, or the `preloadImageMobile` 600w preload is racing with hydration. SK-H10B did not regress — that page got better — which suggests something B01-specific (different number of gallery images? different variants?). Diff B01 vs SK-H10B page-output bundle sizes.
2. **`/collections/on-sale` mobile LCP 9.4 s** — the only page still in the Poor LCP band. Likely the on-sale collection template skips the hero-block treatment applied to `/collections/bait-boards`. Apply the same font-face / hero handling to the on-sale template.
3. **`/articles/how-to-install-a-bait-board` desktop TBT 1,200 ms** — outlier. Mobile is fine (320 ms). Worth a 5-min look at why this article specifically pushes desktop blocking time so high.
4. **Universal ~200–300 KiB unused JS still in the bundle.** Further per-route island reduction would lift the 87/89/93 cluster into solid 95+ territory and the 67/70/73/75 cluster into the 80s. Diminishing returns territory but available.

---

## 5. Minor code-only fixes (<15 min, apply now)

These are the low-effort high-impact items surfaced by the post-fix capture:

1. **`/collections/on-sale` hero-block parity fix** — replicate whatever home/`/collections/bait-boards` got for the hero treatment onto the on-sale collection template. Same Astro layout / collection component should already exist; this is probably one missing `<style>` block or one missing prop. Expected: mobile LCP 9.4 s → ~3 s. **Priority: highest of this section.**
2. **PDP-B01 quick triage** — open the B01 page route in DevTools and check (a) whether the gallery is being hydrated with `client:load` instead of `client:visible`/`client:idle`, (b) whether the `preloadImageMobile` is loading on desktop too (it shouldn't be). If gallery hydration eager, switch to `client:visible`. Expected: TBT down by 500–1,000 ms.
3. **Confirm Archivo 600 preload is route-scoped, not site-wide.** If the inlined @font-face block on FAQ/article pages is still preloading Archivo 600 when those pages don't use weight 600 above the fold, swap the preload onto only home/collection/PDP. Low-risk, modest win.
4. **No-op verification — CLS desktop 0.004** is *not* a regression worth fixing on its own. Below the 0.1 "good" threshold by 25×. Note it; don't chase it.

---

## 6. Method notes

- Tool: Google PageSpeed Insights API v5 via `pagespeed-insights` MCP (`mcp__pagespeed-insights__batch_analyze` + `analyze_page_speed`)
- Lighthouse version: 12 (lab data, simulated throttling, single run per URL × strategy — PSI default)
- One desktop run for PDP-B01 was aborted in the initial batch and re-run individually; results in tables are from the re-run
- INP (lab): not emitted by Lighthouse 12 on PSI default config
- Field data: CrUX still empty for baitboardsdirect.com origin (below inclusion threshold)
- TTFB column blank: the MCP's summary view did not surface TTFB on this batch (it did surface in the morning's parsed-JSON capture). Cloudflare edge cache is presumed to still be sub-5 ms based on the morning's measurement; no DNS / origin changes since then.
- Deploy state at capture: commit 558f5e0, deployed minutes before the 06:06 UTC batch start
