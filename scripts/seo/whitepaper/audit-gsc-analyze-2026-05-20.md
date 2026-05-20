# GSC Baseline Analytics — Pre/At-Cutover Snapshot

**Captured:** 2026-05-20 (cutover day, before post-cutover Google indexation reflects new site state)
**Property:** `https://baitboardsdirect.com/` (URL-prefix, verified)
**Window:** 2026-04-22 to 2026-05-20 (28 days)
**Data state:** All data is from the **PRE-cutover Shopify Dawn theme era** — Google has not yet recrawled or indexed the new Astro site (cutover was today; first deep recrawl + reindex 4-14 days post-cutover).

This document is the GSC "before" baseline for the cutover whitepaper. Post-cutover performance should be compared against these numbers at 30d, 60d, 90d intervals.

---

## 1. Site totals — 28-day window

| Metric | Value |
|---|---:|
| Clicks | **45** |
| Impressions | **1,456** |
| CTR | **3.09%** |
| Avg position | **13.8** |

**Auto-scale tier applied:** small-site (<10k impressions/28d) → workflow floors lowered to A=20, B=10, C=10 (per gsc-analyze skill spec).

---

## 2. Quick wins (Workflow A) — striking-distance keywords, biggest impact

These queries currently rank in position 5-20 with meaningful impressions. Moving them to the top 5 yields immediate click uplift. **Top of the post-cutover SEO work priority list.**

| Query | Page | Position | Impressions | Clicks | Pot. clicks if pos 3 (8% CTR) |
|---|---|---:|---:|---:|---:|
| `bait board` | `/` | 17.7 | **292** | 2 | **~23** |
| `bait boards` | `/` | 11.7 | **117** | 1 | **~9** |
| `boat bait board` | `/` | 19.1 | 75 | 0 | ~6 |
| `bait boards for boats` | `/` | 15.5 | 71 | 0 | ~6 |
| `bait boards victoria` (local!) | `/` | 13.7 | 58 | 0 | ~5 |
| `baitboard` | `/` | 8.1 | 40 | 2 | ~3 (already close) |
| `bait board for boat` | `/` | 18.3 | 24 | 0 | ~2 |
| `boat bait boards` | `/` | 17.6 | 30 | 0 | ~2 |
| `fibreglass bait board` | `/` | 4.6 | 28 | 2 | ~2 (one move to pos 3) |
| `bait boards for sale` | `/` | 16.1 | 23 | 0 | ~2 |

**Aggregate potential**: if all top-10 striking-distance terms reach position 3 (8% CTR), monthly clicks rise from **45 → ~105 = +130% organic clicks**. The cutover work (rich schema, faster CWV, restructured body HTML, image alt text) is exactly the kind of lift Google rewards on these queries within 30-60 days.

---

## 3. CTR opportunities (Workflow B) — high-position, low-CTR

Filter: position < 3.5, impressions ≥ 10.

After applying sitelinks-rotation filter (brand query `bait boards direct` showing on 10 different URLs at pos 1.x — that's Google rotating sitelinks, only the homepage row is real):

| Query | Page | Pos | Impr | CTR | Status |
|---|---|---:|---:|---:|---|
| `bait boards direct` (brand) | `/` | **1** | 14 | **35.7%** | ✓ Above pos-1 benchmark (25-35%) |
| `baitboardsurf` | `/` | 3.4 | 36 | 5.6% | Slightly below pos-3 benchmark (7-10%), small sample |

No actionable CTR opportunities at this traffic level. Brand query CTR is healthy.

---

## 4. Cannibalisation (Workflow C) — multiple pages competing on a query

Filter: ≥2 pages with ≥10 impressions on the same query.

| Query | Pages competing (page → impressions, position) | Recommended action |
|---|---|---|
| `bait board` | `/` (292 imp, pos 17.7) <br> `/collections/bait-boards` (37 imp, pos 47.2) <br> `/products/bait-board-b04` (1 imp, pos 2) | Consolidate to `/`. Or strengthen `/collections/bait-boards` so it overtakes. Note: post-cutover, the collection page has 17 products + tagged content + proper SEO meta — this will shift. |
| `bait boards for sale` | `/` (23 imp, pos 16.1) <br> `/collections/bait-boards` (5 imp, pos 26.4) | Mild cannibalisation. Homepage winning, no urgent action. |
| `boat bait boards for sale` | `/` (4 imp, pos 12.2) <br> `/collections/bait-boards` (1 imp, pos 10) | Negligible. |

**Sitelinks rotation (not real cannibalisation):**
- `bait boards direct` brand query: rotates across `/`, `/collections`, `/collections/all`, `/collections/bait-boards`, `/collections/on-sale`, `/pages/about-us`, `/pages/contact`, `/pages/faqs`, 2 PDPs — all at pos 1-6. Standard Google sitelinks behaviour for known brand queries. **No action needed.**

---

## 5. Content decay (Workflow D) — SKIPPED

**Cutover guard triggered.** Migration date = 2026-05-20 = today. Any 28d-vs-prior-90d comparison would span the cutover and produce spurious "100% decay" signals on every page that's now served by the new Astro site (Google hasn't recrawled yet → looks like the old page disappeared).

Re-run this workflow at 30d post-cutover (2026-06-20) with windows anchored to post-cutover data only.

---

## 6. Lost queries (Workflow E) — SKIPPED

Same cutover guard. Default 28d-vs-prior-28d would put period 2 across 2026-04-22 to 2026-04-24 (still pre-cutover, fine) but the data quality conclusion would be muddled given the cutover transition. Re-run at 14d post-cutover with shortened windows.

---

## 7. Brand vs non-brand split (Workflow F)

| Category | Clicks | Impressions | Click share | Impression share |
|---|---:|---:|---:|---:|
| **Brand** (`bait boards direct`, `baitboardsdirect`, `baitboard direct`) | ~6 | ~50 | **13.3%** | **3.4%** |
| **Non-brand** (everything else) | ~39 | ~1,406 | **86.7%** | **96.6%** |

**Interpretation:** Very healthy non-brand share for a young e-commerce site. Most ranking happens on commercial intent queries (`bait board`, `bait boards for boats`, `bait boards victoria`). Brand recognition is small (low monthly search volume for "bait boards direct" as a query). Means: SEO effort properly drives discovery of generic category buyers, not just navigational hits.

**Trend:** insufficient data to plot 90-day trend without crossing the cutover. Re-baseline at 60d post-cutover.

---

## 8. Device split

| Device | Clicks | Impressions | CTR | Avg position |
|---|---:|---:|---:|---:|
| Mobile | **27** (60%) | 717 (49%) | **3.77%** | **11.1** |
| Desktop | 17 (38%) | 732 (50%) | 2.32% | 16.5 |
| Tablet | 1 (2%) | 7 | 14.3% | 17.0 |

**Observation:** Mobile is the higher-CTR + better-position channel — and customers convert better on mobile (per pre-cutover baseline data). Sub-conclusions:

- Mobile ranks **5.4 positions higher than desktop** on average — likely because the OLD Shopify Dawn theme had mobile-first responsive design that Google rewarded.
- The new Astro site has been built mobile-first too (text-base announcement bar, mobile carousel, responsive hero image). Expect mobile parity to be preserved post-cutover.
- **Pre-cutover GA4 baseline confirmed 90% AU traffic mobile-dominant.** Continue mobile-first development priority.

---

## 9. Top pages

| Page | Clicks | Impressions | CTR | Pos |
|---|---:|---:|---:|---:|
| `/` (homepage) | **36** (80%) | **1,253** (86%) | 2.87% | 14.2 |
| `/collections/bait-boards` | 3 | 128 | 2.34% | 24.1 |
| `/products/bait-board-b01` | 1 | 15 | 6.67% | 4.3 |
| `/products/bait-board-jj-12` | 1 | 22 | 4.55% | 3.6 |
| `/products/bait-board-b02` | 1 | 26 | 3.85% | 9.0 |
| `/products/leaning-post-top-only-blk` | 1 | 17 | 5.88% | 11.1 |
| `/products/bait-board-hh-14` | 1 | 3 | 33.3% | 3.3 |
| 9 archived seaking-* URLs | 1 total | ~10 | — | — |

**Concentration risk:** **homepage carries 80% of clicks and 86% of impressions.** PDPs barely register. Post-cutover SEO work (proper Product schema with prices + availability + reviews placeholder, better PDP titles via metafields, internal linking from collection pages) should distribute discovery across more landing pages.

Pages 9-34 in the list include archived Shopify URLs (`seaking-h10-white-fiberglass-fillet-table` etc.) that Google has cached and will gradually drop from the index now that we've archived them + 301-redirected via worker.js.

---

## 10. Cutover-day baseline — concrete "before" numbers for the whitepaper

To compare against at 30d / 60d / 90d post-cutover (re-run this report on 2026-06-20, 2026-07-20, 2026-08-20):

| KPI | At cutover (2026-05-20) | Target at 30d | Target at 60d | Target at 90d |
|---|---:|---:|---:|---:|
| 28-day clicks | 45 | 60-75 (+30-65%) | 90-110 (+100-145%) | 130-170 (+185-280%) |
| 28-day impressions | 1,456 | 2,000-2,400 | 2,800-3,600 | 3,800-5,000 |
| 28-day CTR | 3.09% | 3.2-3.5% | 3.5-4.0% | 4.0-4.5% |
| Avg position | 13.8 | 12.5-13.0 | 11.0-12.0 | 9.5-10.5 |
| `bait board` position | 17.7 | 13-15 | 9-12 | 5-8 |
| `bait boards` position | 11.7 | 9-11 | 7-9 | 5-7 |
| `bait boards victoria` position | 13.7 | 10-12 | 7-9 | 4-6 |
| Indexed canonical URLs | unknown (need GSC Pages report) | 16-20 | 25-30 | 30+ |
| Brand share of clicks | 13% | 13-15% | 13-18% | 15-20% |

**Targets are illustrative** — driven by the assumption that the cutover's CWV / schema / content-quality improvements compound over 90 days as Google recrawls and reweights signals. Actual results depend on Google's algorithm and competitor moves.

---

## 11. Outstanding for whitepaper Day 30+

- **Indexation coverage report** — re-run `inspect_url_enhanced` on 12 priority URLs at 30d to verify recrawl is happening
- **Position 1-3 keyword count** — currently 1 query at pos 1 (`bait boards direct` brand); aim for 5+ commercial queries at pos 1-3
- **Cannibalisation re-check** — verify the `/collections/bait-boards` page overtakes home for `bait board`-class queries post-cutover (it should — better-targeted, more focused content)
- **Lost queries analysis** — at 60d, can run lost-queries workflow properly
- **Sitemap coverage** — check that all 88 sitemap URLs are crawled at 30d
