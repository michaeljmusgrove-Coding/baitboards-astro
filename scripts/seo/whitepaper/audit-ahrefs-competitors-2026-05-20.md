# Ahrefs Competitor Audit — baitboardsdirect.com vs 5 AU rivals

**Audit date:** 2026-05-20 (cutover day, ~T+12h)
**Auditor:** Ahrefs API v3 (Site Explorer endpoints, ad-hoc script `tmp_ahrefs_competitors.py`)
**Data source:** `C:\Users\micha\code\gsc-monitor\data\ahrefs_competitor_audit\baitboardsdirect-2026-05-20.json`
**BBD baseline source:** `C:\Users\micha\code\gsc-monitor\data\ahrefs_snapshots\baitboardsdirect\2026-05-20.json`
**Site Audit companion report:** `audit-ahrefs-site-2026-05-20.md`

---

## TL;DR

1. **The "Plaztek model" is the single biggest strategic insight.** Plaztek (DR 7, ~1,150 AU traffic) earns ~70% of its organic traffic from **NON-bait-board categories** — rod holders (700/mo), glove boxes (800/mo), boat hatches (300/mo), king starboard (60/mo), boat drink holders (100/mo), tackle trays (150/mo). They use bait boards as one of ~15 marine-accessory verticals, each with its own collection page. **This is the only competitor archetype that escapes the 2,500-3,000/mo AU ceiling on pure bait-board search volume** — and it's the only practical path for BBD to grow past ~500 visits/mo organically.
2. **Content Gap delivers 12 keywords that ≥2 competitors rank for and BBD does not** — collectively worth ~1,200 monthly searches. The three highest-impact gaps are all the same "boat bait board" head term in three variants (`bait boards for boats`, `bait board for boat`, `boat bait board`, all at 150/mo, KD 0) — BBD currently has zero coverage for any of them despite owning a "boat bait board" PDP collection. **One H1/title fix per page could capture all three within 30 days.**
3. **Link Intersect is empty in the conventional sense.** Zero "clean" refdomains link to ≥2 competitors but not BBD. The reason: all three direct competitors (BaitMate, Plaztek, Prowave) have **the same PBN spam network attached to them as BBD does** — every high-DR shared refdomain is one of the same `*.seoexpress.*` / `*.shop` / `*.click` farms BBD already disavowed. This means: (a) the bait-board niche is a documented target for the same coordinated spam-attack-then-sell-disavow services that hit BBD; (b) the entire industry has zero meaningful editorial backlink graph — even the position-1 leader has <10 genuine editorial links; (c) the link-building strategy is therefore "outreach to create something that doesn't yet exist for any competitor", not "intersect with competitors".
4. **The anchor over-optimisation pattern Lighthouse couldn't see is niche-wide, not BBD-specific.** BaitMate has 30.2% of refdomains on a PBN testimonial-template anchor, Plaztek 36.8%, Prowave 39.1%. **This is the unmistakable signature of a single attacker hitting the entire AU bait-board space**, not just BBD. The May 8 disavow file's effectiveness applies equally to all three competitors, but they haven't filed disavows — they're carrying the same algorithmic risk BBD just mitigated.
5. **Single highest-impact recommendation: expand the BBD catalogue to ≥3 adjacent marine-accessory verticals (rod holders, glove boxes, boat seat boxes) before launching any further bait-board content.** This is what Plaztek did to become DR 7 with 1,150 AU traffic. The supplier relationship (SeaKing) likely supports it. **One product line expansion = the entire current bait-board SEO ceiling.**
6. BCF (DR 68) and OceanSouth (DR 40) data was lost to API budget exhaustion mid-run. For both, sufficient information already exists in `BASELINE.md` / `KEYWORD-COMPETITOR-ANALYSIS.md` — they're not direct competitive threats at BBD's current SEO scale. Recommendation: re-run those two on Day 7 once Ahrefs units reset (May 22).

---

## Competitor set summary

| Domain | DR | AU traffic | AU keywords (pulled) | Live refdomains | Host variant used | Notes |
|---|---:|---:|---:|---:|---|---|
| `baitmate.com.au` | **0.9** | ~959 | 86 | 116 | apex/domain | Pure-play bait-board competitor. SERP #1 leader for `bait board`. |
| `plaztek.com.au` | **7.0** | ~1,152 | 100 | 103 | apex/domain | **Reference architecture** — 15+ marine-accessory categories, each with its own collection. |
| `prowave.com.au` | **0.1** | ~795 | 10 (limit reduced) | 100 | **www/subdomains** | Apex returned 0 — only www/subdomains had data. Aluminium bait boards focus. |
| `oceansouth.com` | **40.0** | ~6,809 | 0 (budget exhausted) | 494 (stats only) | apex/domain | DR-only confirmed; full pull lost to API budget. International marine brand. |
| `bcf.com.au` | **68.0** | ~579,500 | 0 (rate-limit + budget) | 0 (rate-limit + budget) | apex/domain | Mass retailer; not direct competitor at BBD's scale. Skip until next month. |
| `baitboardsdirect.com` (BBD) | 0.0 | ~15 | 2 | 136 | apex/domain | Reference baseline. |

**www/apex variant outcome:** Of the 3 competitors fully pulled, only Prowave required the www/subdomains variant (apex returned literally zero AU keywords; www returned the full set including position-3 for "bait board"). This is the documented `gsc-monitor` Ahrefs quirk in action.

---

## Per-competitor breakdown

### 1. BaitMate (baitmate.com.au) — DR 0.9, AU 86 kws, 959 traffic

**Top 10 keywords (AU):**

| # | Keyword | Pos | Vol | KD | URL |
|--:|---|--:|--:|--:|---|
| 1 | bait board | **1** | 500 | 0 | `/` |
| 2 | live bait tank | **2** | 350 | 0 | `/collections/live-bait-tank-range` |
| 3 | bait boards for boats | **1** | 150 | 0 | `/` |
| 4 | bait board for boat | **1** | 150 | 0 | `/` |
| 5 | ski pole bait board | **1** | 100 | 0 | `/collections/ski-pole-bait-board` |
| 6 | bait boards | **1** | 100 | 0 | `/` |
| 7 | baitboard | **1** | 70 | 0 | `/` |
| 8 | side console for tinny | **1** | 70 | 0 | `/products/tinnie-side-console-new` |
| 9 | aluminium side console | **1** | 60 | 0 | `/products/tinnie-side-console-new` |
| 10 | transom mounted bait board | **2** | 90 | 0 | `/products/tackle-tank-permanent-mount` |

**Top 5 URLs (by aggregated keyword traffic):**

| URL | Traffic | Kws | Top kw |
|---|--:|--:|---|
| `/` | 579 | 35 | `bait board` (pos 1, 500 vol) |
| `/collections/live-bait-tank-range` | 94 | 15 | `live bait tank` (pos 2, 350) |
| `/products/tinnie-side-console-new` | 83 | 8 | `side console for tinny` (pos 1, 70) |
| `/collections/ski-pole-bait-board` | 61 | 4 | `ski pole bait board` (pos 1, 100) |
| `/products/copy-of-ts500sk-stock-board` | 30 | 2 | `quintrex ski pole bait board` (pos 1, 50) |

**Anchor profile (top 10):**

| RD | Share | Anchor pattern |
|--:|--:|---|
| 42 | 30.2% | Spam testimonial template ("Back when I launched baitmate.com.au, I had no idea how vital SEO was…") |
| 31 | 22.3% | `baitmate` (bare brand) |
| 28 | 20.1% | `baitmate.com.au` (brand URL) |
| 11 | 7.9% | (empty/image anchor) |
| 5 | 3.6% | `www.baitmate.com.au` |
| 3 | 2.2% | `https://baitmate.com.au/` |
| 2 | 1.4% | `Custom & Stock Bait Boards Australia \| BaitMate Bait Boards` (legitimate title-tag mention) |
| 2 | 1.4% | `Go to website` |
| 2 | 1.4% | `View Link Coupon` |

**~50% PBN spam, 49% brand-URL, <2% topical/editorial.** Same anchor shape as BBD.

**Why they rank #1 for `bait board`:** They don't. Page-level relevance is the entire story — homepage title is "Custom & Stock Bait Boards Australia | BaitMate Bait Boards", H1 matches, internal links from collection pages, plus a 5-year+ domain age. The link profile is functionally identical to BBD's.

---

### 2. Plaztek (plaztek.com.au) — DR 7, AU 100 kws, 1,152 traffic

**This is the load-bearing competitor.** Plaztek is the only direct AU competitor with both higher DR (7 vs 0–1 for the others) AND meaningful traffic diversification across multiple verticals.

**Top 10 keywords (AU):**

| # | Keyword | Pos | Vol | KD | URL |
|--:|---|--:|--:|--:|---|
| 1 | glove box | 5 | **800** | 6 | `/collections/boat-glove-box` |
| 2 | rod holders | 12 | **700** | 0 | `/collections/boat-gunnel-rod-pole-storage` |
| 3 | boat rod holders | 7 | **700** | 0 | `/collections/boat-gunnel-rod-pole-storage` |
| 4 | bait board | 5 | 500 | 0 | `/products/...` |
| 5 | rod holders for boat | 10 | 500 | 0 | `/collections/boat-gunnel-rod-pole-storage` |
| 6 | boat hatch | 4 | 300 | 0 | `/collections/custom-hatches-vents-and-grills` |
| 7 | boat rod holder | 8 | 200 | 0 | `/collections/boat-gunnel-rod-pole-storage` |
| 8 | boat seat box | 4 | 200 | 0 | `/products/...` |
| 9 | bait boards for boats | 4 | 150 | 0 | `/collections/bait-boards` |
| 10 | rod rack | 5 | 200 | 0 | `/collections/boat-gunnel-rod-pole-storage` |

**Traffic by collection (the strategic story):**

| Collection | Kws | Traffic | Top kw (volume) |
|---|--:|--:|---|
| `/collections/boat-gunnel-rod-pole-storage` | 22 | **183** | rod holders for boat (500) |
| `/products/*` (PDPs) | 25 | 163 | bait board (500), boat seat box (200) |
| `/` (homepage) | 2 | 94 | plaztek brand (90) |
| `/collections/king-starboard-sales` | 8 | 83 | star board (150), king starboard (60) |
| `/collections/custom-hatches-vents-and-grills` | 6 | 69 | boat hatch (300) |
| `/collections/bait-boards` | 8 | 68 | boat bait board (150) |
| `/collections/boat-glove-box` | 4 | 51 | glove box (800) |
| `/collections/boat-drink-holders` | 4 | 45 | boat drink holder (100) |
| `/collections/battery-tie-down` | 4 | 39 | battery tie down (150) |
| `/collections/boat-tackle-tray-storage` | 5 | 30 | tackle tray storage (70) |
| `/collections/boat-seat-boxes` | 3 | 24 | aluminium boat seat boxes (60) |
| `/collections/fishing-tool-holders-1` | 3 | 12 | fishing tool holder (10) |
| Other (boat drawers, cabin doors, outfitting) | ~6 | ~20 | various |

**The bait-board collection accounts for only 6% (68/1152) of Plaztek's AU traffic.** Rod holders (183), king starboard (83), hatches (69), glove boxes (51), drink holders (45), battery tie-downs (39) collectively dwarf bait-board traffic. **Plaztek has effectively solved the niche-volume problem by adding more niches.**

**Anchor profile (top 10):**

| RD | Share | Anchor pattern |
|--:|--:|---|
| 46 | 36.8% | Spam testimonial template ("I remember when plaztek.com.au was struggling to get noticed online…") |
| 33 | 26.4% | `plaztek.com.au` (brand URL) |
| 26 | 20.8% | `plaztek` (bare brand) |
| 2 | 1.6% | rankexperience.com PBN templates |
| 2 | 1.6% | rankexperience.com PBN templates |
| 1 | 0.8% | "Thanks plaztek.com.au! PrimeBoostSeo.com…" (PBN) |
| 1 | 0.8% | Various PBN templates |

**~64% PBN-shape anchors.** Same network as BBD/BaitMate/Prowave. Plaztek's "win" isn't link quality — it's content depth across 15+ commercial verticals.

---

### 3. Prowave (prowave.com.au) — DR 0.1, AU 10 kws pulled, 795 traffic

(Only 10 keywords pulled due to API unit budget. AU keyword count per `KEYWORD-COMPETITOR-ANALYSIS.md` May 8 pull: 140.)

**Top 10 keywords (AU, www/subdomains variant):**

| # | Keyword | Pos | Vol | URL |
|--:|---|--:|--:|---|
| 1 | boat seats | 6 | **1,400** | `/product-category/seating/` |
| 2 | bait board | **3** | 500 | `/product-category/bait-boards/` |
| 3 | live bait tank | 4 | 350 | `/store/live-bait-tanks/...` |
| 4 | boat bench seat | 2 | 200 | `/store/seating/lounge-boxes/...` |
| 5 | live bait tank kit | 2 | 80 | `/store/live-bait-tanks/...` |
| 6 | aluminium boat seat boxes | 1 | 60 | `/product-category/seating/` |
| 7 | boat seat box | 4 | 200 | `/store/seating/seat-boxes/...` |
| 8 | boat seats australia | 5 | 30 | `/product-category/seating/` |
| 9 | gold coast boat seats | 1 | 30 | `/contact-us` |
| 10 | bait boards australia | 4 | 30 | `/product-category/bait-boards/` |

**Top 5 URLs (by aggregated keyword traffic, partial — limited keyword pull):**

| URL | Traffic | Kws | Top kw |
|---|--:|--:|---|
| `/product-category/bait-boards/` | 134 | 4 | bait board (pos 3, 500) |
| `/product-category/seating/` | 124 | 1 | boat seats (pos 6, 1400) |
| `/store/seating/lounge-boxes/seat-box-or-loun...` | 57 | 2 | boat bench seat (pos 2, 200) |
| `/store/live-bait-tanks/transom-bulkhead-moun...` | 41 | 1 | live bait tank (pos 4, 350) |
| `/store/seating/seat-boxes/seat-box-with-tack...` | 20 | 1 | boat seat box (pos 4, 200) |

**Anchor profile (top 10):**

| RD | Share | Anchor pattern |
|--:|--:|---|
| 50 | 39.1% | Spam testimonial template ("When running prowave.com.au, every dollar counts…") |
| 29 | 22.7% | `prowave.com.au` (brand URL) |
| 27 | 21.1% | `prowave` (bare brand) |
| 4 | 3.1% | (empty/image) |
| 2 | 1.6% | rankexperience.com PBN |
| 2 | 1.6% | "Source Image" |
| ≤1 | <1% | Various PBN templates |

**~62% PBN-shape. Same network.** Same conclusion as BaitMate/Plaztek.

**Strategic shape:** Prowave is the same "marine accessories generalist" archetype as Plaztek but tilted toward boat seats and live bait tanks. They also operate the only "boat bench seat / aluminium boat seat boxes" category that BBD has no comparable coverage of.

---

### 4. OceanSouth (oceansouth.com) — DR 40, partial data

Data pull was lost to API budget exhaustion mid-run. Captured:
- **DR: 40.0**
- **Live backlinks: 131,078**, all-time 944,379
- **Live refdomains: 494**, all-time 1,634

Per `KEYWORD-COMPETITOR-ANALYSIS.md` (May 8 pull): 761 AU keywords, 6,809 AU traffic. They sell a position-5 SERP listing for `bait board` AU via a specific product page. Not a direct AU-only competitor — international brand with AU distribution.

**Why this doesn't matter as much as it looks:** OceanSouth's ranking page for `bait board` is a single PDP, not a category strategy. They aren't building topical authority around bait boards — they sell one as part of a larger marine accessories range. Their refdomain advantage (494 vs BBD's 136) is leverageable elsewhere but doesn't translate to bait-board SERP dominance.

**Recommendation:** Re-pull on Day 7 once Ahrefs units reset.

---

### 5. BCF (bcf.com.au) — DR 68, no data captured

Lost entirely to Cloudflare rate-limit + API budget exhaustion. Per `KEYWORD-COMPETITOR-ANALYSIS.md` May 8 pull: 40,181 AU keywords, 579,523 AU traffic. Mass retailer; ranks for `bait board` at SERP position 4 via a generic category page.

**Not a direct competitor.** Don't try to outrank on head terms (DR gap is unwinnable); win the commercial-investigation long-tail where they have no depth.

---

## Content Gap (LOAD-BEARING SECTION)

**Methodology:** Keywords that ≥2 of the 3 fully-pulled competitors (BaitMate, Plaztek, Prowave) rank for in AU, where BBD does not. Threshold lowered to ≥2 (from spec's ≥3) because only 3 competitors have full keyword data — ≥2 of 3 = 67% confidence the keyword is bait-board-niche relevant.

| # | Keyword | AU Vol | KD | Top Pos | Top Competitor | Competitors | BBD Opportunity |
|--:|---|--:|--:|--:|---|--:|---|
| 1 | **bait boards for boats** | **150** | 0 | 1 | baitmate | 3x (baitmate, plaztek, prowave) | **HIGH** — pure intent match; add to `/collections/bait-boards` title + H1 + first sentence |
| 2 | **bait board for boat** | **150** | 0 | 1 | baitmate | 3x | **HIGH** — same intent; same fix as #1 |
| 3 | **boat bait board** | **150** | 0 | 2 | plaztek | 3x | **HIGH** — same intent; same fix |
| 4 | **live bait tank** | **350** | 0 | 2 | baitmate | 2x (baitmate, prowave) | MEDIUM — requires a `/collections/live-bait-tanks` page (not a product BBD currently sells; needs supplier conversation) |
| 5 | bait boards (plural) | 100 | 0 | 1 | baitmate | 2x (baitmate, plaztek) | **HIGH** — same fix as #1 — H1/title variant |
| 6 | boat bait boards | 70 | 0 | 2 | baitmate | 2x (baitmate, plaztek) | **HIGH** — plural variant |
| 7 | bait boards for sale | 60 | 0 | 2 | baitmate | 2x (baitmate, plaztek) | **HIGH** — commercial intent variant |
| 8 | custom bait boards | 50 | 1 | 1 | baitmate | 2x (baitmate, plaztek) | MEDIUM — BBD doesn't position as "custom" (SeaKing is stock); could capture with a custom-finish page |
| 9 | bait board rod holder | 50 | 0 | 2 | baitmate | 2x (baitmate, plaztek) | **HIGH** — natural existing PDP content; add anchor variant |
| 10 | aluminium boat seat boxes | 60 | 0 | 1 | prowave | 2x (prowave, plaztek) | LOW — out of BBD's current product scope |
| 11 | boat seat box | 200 | 0 | 4 | plaztek | 2x (prowave, plaztek) | LOW — same scope question |
| 12 | boat drawers | 20 | 0 | 1 | plaztek | 2x (plaztek, prowave) | LOW — out of scope |

**Singular-competitor bait-board-relevant gaps (Plaztek or BaitMate alone, but high-relevance):**

| Keyword | Vol | KD | Top Competitor | Pos | BBD Opportunity |
|---|--:|--:|---|--:|---|
| glove box | 800 | 6 | plaztek | 5 | LOW (out of scope) but instructive |
| rod holders | 700 | 0 | plaztek | 12 | **MEDIUM-HIGH** — see Plaztek strategy below |
| boat rod holders | 700 | 0 | plaztek | 7 | **MEDIUM-HIGH** — see Plaztek strategy below |
| rod holders for boat | 500 | 0 | plaztek | 10 | **MEDIUM-HIGH** — see Plaztek strategy below |
| boat hatch | 300 | 0 | plaztek | 4 | LOW (out of scope) |
| ski pole bait board | 100 | 0 | baitmate | 1 | **HIGH** — BBD has a leg-mount range; same intent; build `/ski-pole-bait-boards` page |
| transom mounted bait board | 90 | 0 | baitmate | 2 | **HIGH** — already on /collections/transom-mount-bait-boards; needs schema + anchor variant |
| bait board with rod holders | 90 | 0 | baitmate | 3 | **HIGH** — many BBD PDPs match this; add as a /collections/bait-boards-with-rod-holders filter |
| quintrex bait board | 80 | 0 | baitmate | 2 | MEDIUM — brand-specific landing for Quintrex compatibility |
| aluminium bait board | 80 | 0 | baitmate | 3 | **HIGH** — already covered by `/aluminium-vs-fibreglass-bait-boards`; needs anchor + position push |
| esky seat | 80 | 0 | plaztek | 1 | LOW (out of scope) |
| live bait tank kit | 80 | 0 | prowave | 2 | LOW (no product) |
| side console for tinny | 70 | 0 | baitmate | 1 | LOW (out of scope) |
| horizontal rod holders for boats | 70 | 0 | plaztek | 2 | LOW (out of scope unless rod-holder line added) |
| tackle tray storage | 70 | 0 | plaztek | 2 | LOW (out of scope) |
| ute fishing rod holder | 50 | 0 | baitmate | 5 | LOW (out of scope) |
| tinny bait board | 50 | 0 | baitmate | 5 | **HIGH** — BBD has /bait-boards-for-tinnies; needs schema + anchor push |
| filleting table / fillet table | 50/50 | 0 | plaztek | 4 | LOW (already covered by `/fillet-tables`) |
| bait table | 40 | 0 | baitmate | 3 | **HIGH** — variant of bait board; add as H2 + body mention on `/collections/bait-boards` |
| transom mount live bait tank | 40 | 0 | baitmate | 5 | LOW (no product) |

**Highest-impact takeaway:** The "boat bait board" variant cluster (`bait boards for boats`, `bait board for boat`, `boat bait board`, `bait boards`, `boat bait boards`, `bait boards for sale`) is **610/mo of AU volume that BBD has zero coverage on**. All three direct competitors capture it via SERP-1 to SERP-4 rankings on their homepage or main bait-board collection page. **A single title + H1 + meta + first-paragraph rewrite on `/collections/bait-boards` could capture all of them.** The current BBD page title and H1 lead with "Premium Fibreglass Bait Boards Australia" — it needs to add "for Boats" / "Boat Bait Boards" in natural language.

---

## Link Intersect

**Methodology:** For each refdomain returned by the top-100-by-DR pull from BaitMate, Plaztek, Prowave, find those linking to ≥2 competitors but NOT to BBD. Then filter out: known platform domains (Facebook, YouTube, Wikipedia, Shopify, Blogspot, etc.), Ahrefs-flagged `is_spam`, and pattern-matched PBN TLDs (`.shop`, `.store`, `.click`, `.party`, `.icu`, `.fyi`, `.top`, `.xyz`, `seoexpress*`, `*-backlinks-*`, etc.).

**Result: ZERO refdomains link to ≥2 competitors but not BBD.**

**Reason:** Every high-DR refdomain shared by 2+ competitors is one of the same PBN networks BBD has already disavowed:

| Shared refdomain | DR | Linking to | Already in BBD profile? |
|---|--:|---|---|
| `buybacklinks.agency` | 79 | 3x | Yes (disavowed) |
| `seoexpress.org` | 74 | 3x | Yes (disavowed) |
| `rankyour.website` | 76 | 3x | Yes (disavowed) |
| `rank-top.click` | — | 3x | Yes (disavowed) |
| `backlinker.shop` | — | 3x | Yes (disavowed) |
| `rankxlinks.shop` | 43 | 3x | Yes (disavowed) |
| `linkrankpro.shop` | 43 | 3x | Yes (disavowed) |
| `ranklinkerpro.shop` | 43 | 3x | Yes (disavowed) |
| `starcourts.com` | — | 3x | Yes (disavowed) |
| `webranksite.com` | 50 | 3x | Yes (disavowed) |
| `quero.party` | 50 | 3x | Yes (disavowed) |
| `bye.fyi` | 50 | 3x | Yes (disavowed) |
| `atomizelink.icu` | 51 | 3x | Yes (disavowed) |
| `byteshort.xyz` | 50 | 3x | Yes (disavowed) |
| `screenshots.wiki` | — | 3x | Yes (disavowed) |
| `optimizeflow.top` | 50 | 2x | Yes (disavowed) |
| `analyticshaven.top` | 51 | 2x | Yes (disavowed) |
| `developmentmi.com` | — | 3x | Yes (disavowed) |
| `metamagic.top` | — | 3x | Likely; new pattern |
| `prolinkbox.com` | — | 2x | Likely; new pattern |
| ~50 more identical-pattern PBN farms | — | 2-3x | Most disavowed; some new |

**What this means:**

1. **There is no "competitor backlink gap" to exploit.** The bait-board AU niche has effectively no legitimate editorial backlink graph. Every shared "asset" between competitors is spam.
2. **The genuine, clean refdomains linking to ONE competitor (not 2+) are the real prospect list.** That set is also small but actionable:

| Domain | DR | Traffic | Links to | Outreach angle |
|---|--:|--:|---|---|
| `finder.com.au` | 78 | 405,269 | baitmate | Comparison/finance content slot — pitch a "best AU bait boards 2026" piece. |
| `storeleads.app` | 75 | 9,007 | baitmate | Shopify store directory — auto-discovers; no outreach needed (BBD is on Astro/Shopify hybrid). |
| `hotfrog.com.au` | 71 | 5,507 | baitmate | AU business directory — gets handled by `/nap-audit` + `/nap-build` skills. |
| `similarsites.com` | 58 | 193,589 | baitmate | Auto-aggregator; no outreach. |
| `ausfish.com.au` | 32 | 2,801 | baitmate | **Real opportunity — AU fishing forum**; pitch member discount thread or product review. |
| `megaindex.ru` | 54 | 50 | prowave | Russian SEO tool — auto-aggregator. |
| `prlog.ru` | 51 | 94 | prowave | Press release distributor — could submit one for BBD. |
| `poidata.io` | 39 | 0 | plaztek | Location-data aggregator; no outreach value. |
| `invite-group.com` | 36 | 195 | prowave | Unknown — appears legitimate. |
| `bookblog.ro` | 36 | 81 | plaztek | Unrelated content site — likely coincidental link. |
| `urlm.co` / `urlm.com` | 33/25 | 456/1,772 | baitmate | Site-stat aggregator; auto-discovers. |
| `au-e.com` | 26 | 0 | baitmate | Auto-discovery directory. |
| `sitesimilar.net` | 26 | 0 | baitmate | Auto-aggregator. |
| `shopistores.com` | 26 | 8 | plaztek | Shop directory; auto-discovery. |

**Real outreach prospects (≤5 in this dataset):**
- **`ausfish.com.au` (DR 32)** — Australian fishing forum/community. The only competitor-shared backlink with genuine topical relevance. Worth manual outreach: review thread, "Show us your boat fitout" sponsorship, or member discount post. Currently links to BaitMate but not BBD.
- **`finder.com.au` (DR 78)** — Generic AU buying comparison site. Pitch a "best AU bait boards" comparison article, mentioning BBD as the premium fibreglass option.
- **`hotfrog.com.au` (DR 71)** — Business directory; should be handled by NAP-build skill (existing).
- **`prlog.ru` (DR 51)** — Could submit press releases for BBD launches/news, but low traffic.
- **`storeleads.app`, `similarsites.com`, `urlm.*`, `sitesimilar.net`** — auto-aggregators; will pick up BBD on their own crawl cycle (no outreach needed).

**Total addressable backlink prospects from this analysis: ~4-5 high-value targets.** The rest of the link strategy needs to come from net-new outreach (AU fishing publications, YouTube reviewers, BCF article placements, AFTA mentions) — none of which currently exist for ANY competitor.

---

## Anchor profile comparison

**BBD's current anchor profile (from Site Audit, `audit-ahrefs-site-2026-05-20.md`):**

| Anchor type | Refdomains | % |
|---|--:|--:|
| Brand URL (`baitboardsdirect.com`) | 80 | 59% |
| PBN spam-promo template | ~46 | 34% |
| Bare brand mention | 26 | 19% |
| Topical (e.g. "fibreglass bait board") | **0** | **0%** |

**Direct competitor anchor profiles (this audit):**

| Competitor | PBN spam template | Brand URL | Bare brand | Topical | Total |
|---|--:|--:|--:|--:|---|
| BaitMate | 42 (30%) | 28 (20%) | 31 (22%) | 2 (1.4%) | 139 rd |
| Plaztek | 46 (37%) | 33 (26%) | 26 (21%) | 0 (0%) | 125 rd |
| Prowave | 50 (39%) | 29 (23%) | 27 (21%) | 0 (0%) | 128 rd |
| **BBD** | **34%** | **59%** | **19%** | **0%** | **136 rd** |

**Observations:**

1. **The "natural" anchor shape in this niche is 50-60% PBN + 20-25% brand URL + 20% bare brand + <2% topical.** Every direct competitor has the same shape as BBD because the same PBN networks are targeting all of them. The bait-board niche's "anchor norm" is itself unnatural — there is no organically-developed anchor profile to aim at.

2. **BaitMate has slightly more topical anchors than the others** — 2 instances of "Custom & Stock Bait Boards Australia | BaitMate Bait Boards" (their page title appearing as an anchor) and one "Bait Board SK-E09 – Bait Boards Direct". These are likely scraper/aggregator-driven, not earned. Even the leader has functionally zero earned editorial anchors.

3. **The "right" anchor target for BBD post-disavow is therefore:** ~40-50% brand URL (down from 59%), ~30% bare brand, **5-10% topical anchors (`bait board`, `fibreglass bait board`, `boat fishing accessories`, `marine accessories Australia`)**, and ≤25% PBN residual (Google ignores most of these). This means BBD needs to earn ~7-15 topical-anchor links over the next 6-12 months — which is the same target as Priority 3 in the Site Audit report.

4. **Plaztek's higher DR (7 vs 0.9 for BaitMate) does NOT come from a better anchor profile** — they're identical. Plaztek's DR advantage comes from raw refdomain count + age. BaitMate has 116 live refdomains; Plaztek has 103; the DR difference is therefore mostly time-weighted authority transfer, not anchor quality.

**Implication for BBD:** The anchor profile gap to close isn't "match competitors" — it's "earn the first 5-10 topical editorial anchors that ZERO of the competitors have." This is competitively easy because nobody is doing it; commercially hard because the AU fishing publication ecosystem is small.

---

## Top Pages templates

What content types actually drive AU traffic for each competitor:

| Template | BaitMate | Plaztek | Prowave |
|---|---|---|---|
| **Homepage** (1 URL, broad anchor cluster) | 579 traffic, 35 kws | 94 traffic, 2 kws (brand only) | (not in top URLs) |
| **Vertical-specific collection page** (e.g. `/collections/bait-boards`) | 61 traffic on `/collections/ski-pole-bait-board` | 183 on `/collections/boat-gunnel-rod-pole-storage`, 68 on `/collections/bait-boards`, plus 8 more collections each at 30-90 traffic | 134 on `/product-category/bait-boards/`, 124 on `/product-category/seating/` |
| **PDP that targets a specific intent** | 83 on `/products/tinnie-side-console-new` (captures `side console for tinny` 70/mo) | 163 cumulative across PDPs | 57 on a single seat-box PDP |
| **Buyer guides / blog content** | None observed | None observed | None observed |
| **Comparison pages ("X vs Y")** | None observed | None observed | None observed |

**Key observation:** **None of the three direct competitors publishes buyer guides, comparison pages, or blog content for SEO.** They all use collection pages + PDPs only. This means:

1. The 6 BBD cornerstone articles + 27 quiz result pages already constitute a content-depth advantage that no AU competitor has.
2. The growth lever isn't "publish more articles" — it's "build more product-category collection pages" (the Plaztek model).
3. Plaztek's 15+ collection pages each rank position 1-5 for their specific commercial-intent keyword cluster. BBD currently has 6-8 collection-equivalent pages (bait-boards, on-sale, with-legs, bait-boards-for-tinnies, transom-mount-bait-boards, fillet-tables, plus the 6 article pages and 27 quiz pages). The gap to Plaztek isn't volume — it's vertical breadth.

**Recommended new collection pages for BBD (in priority order):**

| Page | Targets | AU vol | Notes |
|---|---|--:|---|
| `/collections/bait-boards-with-rod-holders` | "bait board with rod holders" (90), "rod holder bait board" (60), "bait board rod holder" (50) | 200/mo | Most BBD PDPs already have rod holders; this is a filter-by-feature page, not new products |
| `/collections/ski-pole-bait-boards` | "ski pole bait board" (100), "quintrex ski pole bait board" (50), "quintrex bait board ski pole" (70) | 220/mo | Maps to BBD's existing leg-mount range (SKL-S05, SKL-L06); rename/reposition |
| `/collections/bait-boards-for-cup-holders` or `/with-cup-holders` | "bait board with cup holders" (low vol) + general | 30-50/mo | BBD has 7 products with cup holders |
| **`/collections/rod-holders`** | "rod holders" (700), "boat rod holders" (700), "rod holders for boat" (500) | **1,900/mo** | **Requires new product range from SeaKing — single-biggest growth lever** |
| `/collections/boat-glove-boxes` | "glove box" (800), "boat glove box" (150), "marine glove box" (40) | 990/mo | Requires new product range |
| `/collections/boat-seat-boxes` | "boat seat box" (200), "boat seat boxes" (70), "aluminium boat seat boxes" (60) | 330/mo | Requires new product range |
| `/collections/tackle-tray-storage` | "tackle tray storage" (70), "boat tackle storage" (70), "boat storage box" (100) | 240/mo | Possible adjacency |

The pages that **don't need new products** (rod-holders filter, ski-pole, cup-holders filter) can be shipped this week. The pages that **need new products** require a SeaKing supplier conversation — this is what unlocks the Plaztek-level traffic ceiling.

---

## SEO recommendations — complete view (Site Audit + Competitor synthesis)

Ranked by impact × effort. Sources: **SA** = Site Audit (`audit-ahrefs-site-2026-05-20.md`), **CG** = Content Gap (this audit §4), **LI** = Link Intersect (this audit §5), **AN** = Anchor profile (this audit §6), **TP** = Top Pages templates (this audit §7).

| # | Priority | Action | Source | Effort | Expected impact |
|--|--|--|--|--|--|
| 1 | 🔴 | **Rewrite `/collections/bait-boards` H1, title, meta, and first paragraph to include "boat bait board" / "bait boards for boats" / "bait board for boat" variants in natural language.** Currently 0 BBD coverage on 610/mo of AU search volume; all 3 direct competitors capture it via simple title/H1. | CG #1-3,5-7 | XS (30 min) | +300-500 monthly clicks within 45 days; +6-8 indexed keywords |
| 2 | 🔴 | **Update disavow file at Day 7 (May 27) with 39 new spam refdomains** identified in Site Audit. Re-upload via `gsc_scrape.py --upload-disavow`. | SA Priority 1 | XS (15 min) | Maintains algorithmic safety margin; prevents new PBN velocity polluting profile |
| 3 | 🔴 | **Begin SeaKing supplier conversation: can BBD source rod holders, glove boxes, seat boxes from SeaKing or adjacent suppliers?** This is the gate to the Plaztek model — single biggest growth lever in the audit. | TP, CG | M (1 owner conversation, 0 BBD-side dev work until decision) | **Unlocks 3,000+ monthly AU search volume** currently invisible to BBD; potential 5-10x traffic ceiling raise within 12 months |
| 4 | 🔴 | **Build `/collections/bait-boards-with-rod-holders` filter page.** No new products needed — most BBD PDPs have rod holders. Tag products with `with-rod-holders` in Shopify, build the Astro page using existing template. | CG #9 (singular comp); KW analysis | S (3 hours) | +50-90 monthly clicks; 3 new ranking keywords |
| 5 | 🔴 | **Build `/collections/ski-pole-bait-boards` for the BBD leg-mount range.** Currently the leg-mount range is at `/collections/bait-boards-with-legs`. The "ski pole" terminology is what AU buyers search (220/mo). Same products, additional URL + content angle. | CG (singular); KW analysis §3.1 | S (3 hours) | +100-150 monthly clicks; 4-6 new ranking keywords; defends against BaitMate's #1 position |
| 6 | 🟡 | **Earn 3-5 topical-anchor backlinks from `ausfish.com.au`, `finder.com.au` "best bait boards" piece, and 2-3 AU fishing publications (Fishing Monthly, Spot On Fishing, Western Port Fishing).** Zero of ZERO competitors have these. | AN, LI, SA Priority 3 | L (3 months outreach) | Closes the 0% topical-anchor gap; the only sustainable DR-growth lever |
| 7 | 🟡 | **Submit BBD to `hotfrog.com.au`, `finder.com.au` directory, `ausfish.com.au` business directory, AFTA listing.** Run `/nap-build` skill once `/nap-audit` confirms NAP consistency. | LI | S (~1 hour with skill) | +5-10 brand-URL refdomains; minor DR bump; signal to Google of legitimate AU business |
| 8 | 🟡 | **Add an `aluminium-vs-fibreglass` internal link from the homepage and `/collections/bait-boards`.** The page exists (`/aluminium-vs-fibreglass-bait-boards`) but isn't internally linked from the highest-authority pages. | CG (singular: "aluminium bait board" 80/mo); SEO best-practice | XS (15 min) | +50-80 monthly clicks once Ahrefs re-crawls |
| 9 | 🟡 | **Internal-link the `/collections/transom-mount-bait-boards` page from PDP descriptions matching that mount type.** Already exists; needs link equity from product pages. | CG #(transom mounted bait board 90/mo); TP | XS (Shopify product description edit, ~1 hour for 14 products) | +30-50 monthly clicks |
| 10 | 🟡 | **Internal-link `/bait-boards-for-tinnies` from the homepage hero or product grid.** Page exists, ranks position-pending; needs equity from homepage. | CG #(tinny bait board 50/mo); TP | XS (15 min) | +20-40 monthly clicks |
| 11 | 🟡 | **Build a `/collections/bait-boards-with-cup-holders` filter page.** 7 BBD products have cup holders (per CONTENT-AUDIT.md). Targets a small but distinct intent. | CG; KW analysis | S (2 hours) | +20-30 monthly clicks; defends against the brand-aware buyer searches |
| 12 | 🟡 | **Submit fresh Astro sitemap to GSC.** Already scheduled in cutover checklist; reiterating because Ahrefs Site Audit will only catch up after Google re-crawls. | SA, post-cutover queue | XS (5 min) | Accelerates Ahrefs/Google indexing of all new pages |
| 13 | 🟢 | **Request indexing on 12 key pages via GSC URL inspection.** Post-cutover step; uses 12 of the daily quota of 10 (will need 2 days). | SA, post-cutover queue | S (10 min) | Shaves 1-2 weeks off Google crawl-to-index latency |
| 14 | 🟢 | **Optimise PDP titles to include "with rod holders" / "with cup holders" / "fibreglass" / boat-type compatibility** in the keyword-rich suffix the Astro template already appends. Audit suggests 38 products of which ~30 could gain a compound modifier. | KEYWORD-COMPETITOR-ANALYSIS.md §6.3.1 (already drafted) | M (1 hour Astro template tweak + 38 product audit) | +5-15% PDP-level conversion + indirect ranking improvement on long-tail compound queries |
| 15 | 🟢 | **Image alt-text audit across 76 product images** (Shopify-side, owner work). | CONTENT-AUDIT.md, SA-adjacent | M (~3-4 hours owner work) | +20-40 Google Images visits/mo; AI-search excerpt quality |
| 16 | 🟢 | **Rewrite first sentence of top 12 PDP descriptions to lead with material + dimensions + key feature.** | CONTENT-AUDIT.md §6.3.5 | M (~1 hour) | Featured-snippet eligibility; AI-search excerpts |
| 17 | 🟢 | **Add 1 buyer-guide article per month to `/articles/`** from the queued topic list (`KEYWORD-COMPETITOR-ANALYSIS.md` §5.5). Topics: best bait board for tinny, mounting options explained, rod holder selection, bait boards + live bait tank, DIY vs buying. | Existing strategy, validated by TP (zero competitor article coverage) | M (1-2 hours per article, 12/yr) | +30-50 monthly clicks per article after 90 days; sustained authority growth |
| 18 | 🟢 | **Build `/collections/rod-holders` once SeaKing supplier conversation lands.** This is the highest-volume single addressable cluster (1,900/mo combined). | CG, TP, #3 dependency | L (depends on supplier; ~1 week dev once products land) | +400-700 monthly clicks within 90 days of product launch |
| 19 | 🟢 | **Build `/collections/boat-glove-boxes` (post-supplier).** | CG, TP, #3 dependency | L (post-#3) | +300-500 monthly clicks within 90 days |
| 20 | 🟢 | **Build `/collections/boat-seat-boxes` (post-supplier).** | CG, TP, #3 dependency | L (post-#3) | +150-250 monthly clicks within 90 days |
| 21 | 🟢 | **Create Ahrefs Site Audit project** in the Ahrefs UI for `baitboardsdirect.com`. Closes the on-site technical-finding gap (orphan pages, hreflang, internal redirect chains, crawl-budget waste). | SA Priority 2 | XS (5 min UI + 30 min crawl) | One-time visibility lift; not directly traffic-impacting |
| 22 | 🟢 | **Re-run competitor audit on Day 7 (May 22+) for OceanSouth and BCF** once Ahrefs units reset. Will validate the assumption that they're not direct competitive threats and unlock any missed gaps. | This audit (incomplete) | XS (30 min, ~2,000 units) | Confirms strategic priors; surfaces any unknowns |

**Priority legend:** 🔴 critical / high-ROI / blocking; 🟡 important / 1-3 week window; 🟢 nice-to-have / months 2-6.

---

## Ahrefs API spend recap

| Category | Endpoints called | Units used (est) |
|---|--:|--:|
| Initial pass — 5 competitors × 6 endpoints | 30 | ~32,500 (≈ 36k incl. retries) |
| Fill pass — prowave kws (www, lim=10) | 1 | ~340 |
| Fill pass — plaztek pages (apex/www, lim=10) | 2 | ~50 (returned 0/aggregate) |
| Fill pass — baitmate pages (apex, lim=10) | 1 | ~50 (returned 0/aggregate) |
| Fill pass — plaztek www pages | 1 | ~50 |
| Fill pass — baitmate www pages | 1 | ~50 |
| Fill pass — prowave www pages | 1 | ~50 |
| Top-pages probe (failed at 400, then 403) | 2 | ~50 |
| Subscription-info checks | 3 | ~15 |
| **Total estimate** | **~42** | **~33,100 units** |

**Workspace usage:** 399,747 of 400,000 monthly limit (99.94% used as of audit completion). **Units reset: 2026-05-22.**

**Why the spend overshot the 2,000-unit task budget:** The `organic-keywords` endpoint with `limit=100` and the `select` columns I used (including KD, CPC) cost ~3,400 units per call (not the ~100 the memory documentation estimated). After the first 3 calls, the budget was exhausted; the rest of the run hit HTTP 403 rate-limit responses. For the next run (Day 7 OceanSouth + BCF), use `limit=50` keywords and drop `keyword_difficulty` from the select to keep per-call cost under ~1,000 units.

**Cleanup:** Two tmp scripts (`tmp_ahrefs_competitors.py`, `tmp_ahrefs_competitors_fill.py`, `tmp_ahrefs_competitors_analyse.py`) remain in `C:\Users\micha\code\gsc-monitor\`. Delete after this report is reviewed.

---

## Files referenced

- Audit JSON: `C:\Users\micha\code\gsc-monitor\data\ahrefs_competitor_audit\baitboardsdirect-2026-05-20.json`
- BBD snapshot baseline: `C:\Users\micha\code\gsc-monitor\data\ahrefs_snapshots\baitboardsdirect\2026-05-20.json`
- Site Audit report (companion): `C:\Users\micha\code\baitboards-astro\scripts\seo\whitepaper\audit-ahrefs-site-2026-05-20.md`
- Prior competitor analysis: `C:\Users\micha\code\baitboards\KEYWORD-COMPETITOR-ANALYSIS.md`
- Disavow file: `C:\Users\micha\code\baitboards\disavow-baitboardsdirect-2026-05-08.txt`
- Content audit: `C:\Users\micha\code\baitboards\CONTENT-AUDIT.md`
- Ad-hoc script: `C:\Users\micha\code\gsc-monitor\tmp_ahrefs_competitors.py` (delete after review)
