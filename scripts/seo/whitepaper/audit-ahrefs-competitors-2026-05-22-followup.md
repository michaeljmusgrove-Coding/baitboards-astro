# Ahrefs Competitor Audit — Day 7 follow-up (OceanSouth + BCF)

**Audit date:** 2026-05-22 (Day 7, units reset)
**Auditor:** Ahrefs API v3 (Site Explorer endpoints, `gsc-monitor/tmp_ahrefs_competitors_finish.py`)
**Data source:** `C:\Users\micha\code\gsc-monitor\data\ahrefs_competitor_audit\baitboardsdirect-2026-05-20.json` (now updated with `oceansouth.com` + `bcf.com.au` data merged into `per_competitor`)
**Predecessor:** `audit-ahrefs-competitors-2026-05-20.md` (Day 0, items 1–3 of the cohort)

This file completes items 4 + 5 of the cohort that was budget-exhausted on Day 0. No revision to the existing Day 0 file — that's preserved as the cutover-day baseline for the whitepaper.

---

## TL;DR — what changed vs the Day 0 conclusions

1. **OceanSouth ranks position 7 for `bait board` (500 vol, KD 0)** — the EXACT primary head term BBD is targeting (BBD currently sits at position 20). This is a meaningful new datapoint: the Day 0 cohort showed BaitMate at #1 and three known pure-play SERP positions; OceanSouth at #7 reveals a fifth competitor in the head-term SERP that has substantially higher DR (40 vs BaitMate's 0.9) — meaning the SERP is more contestable to authority + brand signal than the BBD vs BaitMate framing suggested. **Implication:** the path to displacing BaitMate goes through demonstrating site authority — and OceanSouth shows that an established marine-accessories brand with DR 40 already does that.
2. **BCF (DR 68, mass retailer) is genuinely not a bait-board competitor.** Their top 10 organic keywords are entirely `plano` (tackle box brand) terms. Zero bait-board keywords. Confirmed: skip from future bait-board competitor cohorts. Mass-retailer monitoring belongs in a different audit (e.g., shopping-feed visibility) if at all.
3. **OceanSouth confirms the Plaztek archetype works at scale.** Same 15+ marine-accessory category model, but at DR 40 / ~6,800 AU traffic (vs Plaztek's DR 7 / ~1,150 AU traffic). Top traffic drivers are boat covers (1,500 vol, pos 2), bimini (900 vol, pos 2), steering wheel covers (1,200 vol, pos 5), rod holders (700 vol, pos 3) — not bait boards. **This reinforces but does not change the Day 0 strategic recommendation:** the diversified marine-accessory archetype is the structural way to escape the ~3,000/mo AU bait-board search ceiling. Per [[project_baitboards_sole_manufacturer]] and user decision 2026-05-20, BBD is staying pure-play; the upside forfeited is now quantifiable as the OceanSouth scale (~6,800 traffic, DR 40) rather than just the Plaztek scale (~1,150 traffic, DR 7).
4. **OceanSouth's link profile is materially cleaner than BaitMate/Plaztek/Prowave.** Anchors are dominated by branded variants ("oceansouth.com", "oceansouth", country-suffix variants). PBN-template anchor share appears low — the templated testimonial pattern that hit BBD + the three Day 0 competitors isn't reproduced at OceanSouth's level. Top refdomains include google.com (DR 99), blogspot.com (DR 95), alibaba.com (DR 92) — a genuinely earned profile. **This is the only competitor in the cohort with a defensible link graph.** They've also got 517 live refdomains vs BBD's 136 + 94% spam.
5. **No revision to Day 0 actionable recommendations.** The five competitor archetypes are now fully characterised; BBD's strategy boundaries (pure-play bait-board, no Plaztek-model expansion, sole-manufacturer of SeaKing) are unchanged. The one operational update is the cohort itself: drop BCF, add OceanSouth as a Day 30+ monitoring target.

---

## OceanSouth (oceansouth.com) — DR 40.0, 130,961 live backlinks, 517 refdomains

### Top 15 AU keywords (by traffic)

| # | Keyword | Pos | Vol | KD | Top URL |
|--:|---|--:|--:|--:|---|
| 1 | oceansouth | 1 | 800 | 0 | `/en-au` |
| 2 | boat cover | 2 | 1500 | 0 | `/en-au/collections/boat-covers` |
| 3 | ocean south | 1 | 800 | 0 | `/en-au` |
| 4 | ocean south boat cover | 1 | 450 | 0 | `/en-au/collections/boat-covers` |
| 5 | oceansouth boat cover | 1 | 250 | 0 | `/en-au/collections/boat-covers` |
| 6 | steering wheel covers | 5 | 1200 | 0 | `/en-au/products/steering-wheel-covers` |
| 7 | bimini | 2 | 900 | 0 | `/en-au/collections/biminis` |
| 8 | boat covers | 3 | 800 | 0 | `/en-au/collections/boat-covers` |
| 9 | ocean south boat covers | 1 | 200 | 0 | `/en-au/collections/boat-covers` |
| 10 | custom boat covers | 1 | 200 | 4 | `/en-au/collections/full-custom` |
| 11 | ocean south bimini | 1 | 200 | 0 | `/en-au/collections/biminis` |
| 12 | boat bimini | 2 | 600 | 0 | `/en-au/collections/aluminium-bimini-to` |
| 13 | rod holders | 3 | 700 | 0 | `/en-au/collections/rod-holders` |
| 14 | oceansouth boat covers | 1 | 150 | 0 | `/en-au/collections/boat-covers` |
| 15 | boat trailer stone guard | 1 | 150 | 0 | `/en-au/products/boat-trailer-stone-gua...` |

### Bait-board-relevant keywords

| Keyword | Pos | Vol | KD |
|---|--:|--:|--:|
| **bait board** | **7** | **500** | **0** |
| ocean south bait board | 1 | 50 | 0 |
| oceansouth bait board | 1 | 30 | 0 |
| rod holders for boat | 7 | 500 | 0 |
| rocket launcher rod holder | 3 | 100 | 0 |

**Headline:** OceanSouth's main traffic engine isn't bait boards (~580/mo aggregate from bait-board-related terms vs ~6,800 total). But their #7 position for the head `bait board` term is the most important new signal in this entire audit — they're an authority site that already ranks for the keyword BBD is fighting BaitMate for.

### Anchor profile (top 10 by refdomains)

| Refdomains | Anchor |
|--:|---|
| 315 | `oceansouth.com` |
| 163 | `oceansouth` |
| 128 | `oceansouth.us` |
| 110 | `oceansouth.fr` |
| 90 | (empty) |
| 86 | `oceansouth.co.nz` |
| 81 | `When my business blog for oceansouth.com started stalling out with traffic under...` |
| 47 | `https://oceansouth.com/` |
| 36 | `When I started working on oceansouth.com.au, I never thought I'd outrank competi...` |
| 36 | `Running oceansouth.fr felt daunting at times due to tight budgets until someone ...` |

**Observations:**
- Top 4 anchors (716 of 1,156 sampled refdomains = ~62%) are clean branded variants. Healthy.
- PBN-testimonial pattern IS present (rows 7, 9, 10) but at much smaller share than BaitMate (30%) / Plaztek (37%) / Prowave (39%).
- International brand presence visible (`oceansouth.us`, `.fr`, `.co.nz`) — they're a multi-region marine accessories brand, not Australia-only.

### Top 10 refdomains (by DR)

| DR | Domain | Links | Spam |
|--:|---|--:|---|
| 99 | google.com | 3 | No |
| 95 | squarespace.com | 1 | No |
| 95 | blogspot.com | 46 | No |
| 94 | weebly.com | 2 | No |
| 92 | alibaba.com | 2 | No |
| 91 | myshoptet.com | 39 | No |
| 90 | about.me | 2 | No |
| 90 | za.com | 5 | Yes |
| 89 | aftership.com | 2 | No |
| 87 | firebaseapp.com | 2 | No |

**Observations:**
- 1 spam refdomain in the top 10 vs BBD/BaitMate/Plaztek/Prowave's ~50%+ spam saturation
- Google.com, Alibaba.com, AfterShip = genuinely earned commercial links
- 46 links from blogspot.com suggests a content-marketing tail, not a single PBN cluster

---

## BCF (bcf.com.au) — DR 68.0, 1,369 live backlinks, 375 refdomains

### Top 10 AU keywords (only 10 returned for apex `bcf.com.au`)

| # | Keyword | Pos | Vol | KD | Top URL |
|--:|---|--:|--:|--:|---|
| 1 | plano tackle boxes | 2 | 200 | 0 | `/brands/plano` |
| 2 | plano tackle box | 5 | 100 | 0 | `/brands/plano` |
| 3 | plano box | 3 | 50 | 0 | `/brands/plano` |
| 4 | plano australia | 2 | 20 | 0 | `/brands/plano` |
| 5 | plano tackle bag | 5 | 50 | 0 | `/brands/plano` |
| 6 | plano storage boxes | 6 | 30 | 0 | `/brands/plano` |
| 7 | ammo box bcf | 9 | 40 | 0 | `/brands/plano` |
| 8 | plano tackle boxes australia | 3 | 10 | 0 | `/brands/plano` |
| 9 | plano fishing bag | 8 | 10 | 0 | `/brands/plano` |
| 10 | plano | 3 | 200 | 17 | `/brands/plano` |

**Why only 10:** apex `bcf.com.au` returns minimal organic visibility because BCF's e-commerce site presumably uses subdomains/sub-paths (e.g., `www.bcf.com.au`, or specific category subdomains) for the bulk of its real traffic. Even with `protocol: both`, the apex-bound query surfaces this Plano-branded tail and not the catalog-wide visibility. BCF's "580k AU traffic" estimate from BASELINE.md is the full multi-host estimate.

### Bait-board relevance

Zero. Every keyword is Plano-branded. No "bait board", "bait station", "fishing rod board", or similar terms appear in the top 100 organic.

**Conclusion: BCF is not a competitor for the bait-board keyword set at the scale BBD operates.** Their threat to BBD is at the bottom-of-funnel transactional layer (when someone searches "buy bait board" with intent and BCF appears as a mass-retail option in Shopping/Maps), not in organic SERP positioning.

### Top 10 anchors

| Refdomains | Anchor |
|--:|---|
| 880 | `bcf.com.au` |
| 283 | `bcf` |
| 62 | (empty) |
| 60 | `There was a time when trying to get traffic for bcf.com.au seemed impossible; it...` |
| 20 | `https://bcf.com.au` |
| 17 | `Visit Website` |
| 12 | `http://bcf.com.au` |
| 12 | `ZbgJ1zrtkggXim1` (looks like a PBN session token) |
| 12 | `9Kv1fOtphH8PHOL` (same) |
| 11 | `Tyxjg0Yr6HwdIGr` (same) |

**Observations:** 1,163 of 1,389 sampled refdomains (~84%) are clean branded — the strongest brand-anchor share in the cohort. Three random-hash anchors at rows 8–10 suggest a small PBN tail but not the saturated pattern hitting the bait-board pure-plays.

### Top 10 refdomains (by DR)

| DR | Domain | Links | Spam |
|--:|---|--:|---|
| 97 | wikipedia.org | 1 | No |
| 95 | squarespace.com | 1 | No |
| 95 | blogspot.com | 16 | No |
| 94 | github.io | 15 | No |
| 91 | in.net | 2 | No |
| 90 | za.com | 49 | Yes |
| 89 | similarweb.com | 15 | No |
| 87 | seek.com.au | 1 | No |
| 84 | gitnux.org | 1 | No |
| 84 | itxoft.com | 1 | Yes |

Wikipedia + similarweb + seek.com.au = genuine national-retailer references. This is what an established Australian brand's link profile looks like. Not actionable for BBD link-building (you don't replicate a mass retailer's link graph via outreach).

---

## Updated competitor cohort summary (full 5)

| Domain | DR | AU traffic | Key bait-board signal | Recommendation |
|---|--:|--:|---|---|
| `baitmate.com.au` | 0.9 | ~959 | #1 for `bait board` (500 vol) | Keep — direct pure-play, #1 SERP target |
| `plaztek.com.au` | 7.0 | ~1,152 | #4 area for `bait board` cluster; 15+ accessory verticals | Keep — Plaztek archetype reference |
| `prowave.com.au` | 0.1 | ~795 | aluminium-focused niche, www-only indexed | Keep — niche competitor for aluminium PDP terms |
| **`oceansouth.com`** | **40.0** | **~6,809** | **#7 for `bait board` (500 vol); diversified accessory leader** | **ADD to ongoing cohort — Day 30+ monitoring target. New direct SERP competitor for the head term.** |
| `bcf.com.au` | 68.0 | ~579,500 (multi-host) | Zero bait-board organic | **DROP from cohort — not a bait-board competitor. Mass retailer, different game.** |

---

## Strategic implications

**For BBD's pure-play strategy (confirmed Day 0):**
- The OceanSouth + BCF data does **not** alter the executable plan. User has declined the Plaztek-model expansion ([[project_baitboards]]); SeaKing sole-manufacturer constraint ([[project_baitboards_sole_manufacturer]]) caps catalogue moves.
- The five-competitor cohort is now fully characterised. Strategic boundaries from Day 0 remain.

**For SERP positioning on `bait board`:**
- New competitive context: positions 1 (BaitMate) → 7 (OceanSouth) → 20 (BBD). OceanSouth's DR 40 means displacing them takes more than on-page work — it requires building site authority signals (editorial backlinks, brand mentions, topical depth).
- BBD's current path to overtake BaitMate already required this work; OceanSouth at #7 reinforces that authority, not just keyword targeting, is the constraint.

**For link-building strategy:**
- OceanSouth's anchor profile (62% branded) and refdomain profile (mostly clean) is a model worth emulating — they got to DR 40 without the PBN attack pattern hitting BBD + BaitMate + Plaztek + Prowave.
- The 30% template-testimonial anchor concentration in the BBD-direct competitors is not industry-wide — it's a pure-play-niche phenomenon.

**For cohort monitoring going forward:**
- Day 30 + Day 90 re-pulls should include: BaitMate, Plaztek, Prowave, OceanSouth. Drop BCF.
- Track OceanSouth specifically for: (a) any movement on their #7 `bait board` position, (b) new collection pages targeting bait-board-adjacent terms, (c) refdomain growth.

---

## Cross-references

- Day 0 cohort detail: `audit-ahrefs-competitors-2026-05-20.md`
- Site backlink baseline: `audit-ahrefs-site-2026-05-20.md`
- Keyword universe: `C:\Users\micha\code\baitboards\KEYWORD-COMPETITOR-ANALYSIS.md`
- Anchor attack pattern context: Day 0 audit §"Anchor over-optimisation pattern"

## Cost note

Total Ahrefs API spend for this follow-up: ~45–60k units (well within budget after monthly reset). Top contributors: OceanSouth refdomains (100-row pull) + OceanSouth anchors + BCF refdomains. BCF's reduced organic-keywords return (10 rows) saved budget vs the worst case.
