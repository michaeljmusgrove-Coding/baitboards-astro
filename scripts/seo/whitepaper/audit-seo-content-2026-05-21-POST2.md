# SEO Content Quality + E-E-A-T Audit — baitboardsdirect.com (POST2, Day +1)

**Audit date:** 2026-05-21 (T+1 day after 2026-05-20 cutover; re-run after 2026-05-20 pm content batch)
**Auditor:** Content quality sub-skill (curl + raw HTML inspection, cache-busted `?cb={ts}`, NO WebFetch)
**Scope:** Homepage + 6 cornerstone articles + about + FAQs + sitemap freshness
**Prior captures:**
- `BASELINE.md` (2026-05-06, pre-rebuild Shopify theme) — overall content score **18 / 100**
- `audit-seo-technical-2026-05-20-POST.md` (T+8h, after batch 1+2) — technical 87 → 93
- `audit-cro-2026-05-20-POST.md` (T+8h) — 11/14 trackable items resolved
**Changes since prior POST (verified live in this pass):**
- Article internal linking — choose + top-5 link to `/collections/bait-boards-with-rod-holders` and `/collections/bait-boards-with-cup-holders`
- Outbound E-E-A-T citations — install article: Sikaflex 291 (×2) + 3M 4000UV (×2); maintenance article: Wikipedia SAE 316L (×1)
- A1 homepage metafield refresh
- Sitemap `<lastmod>` stamping
- Article schema `@id` trailing-slash fix (prior finding #12 — verified resolved)

---

## TL;DR — score delta

**Content quality score: 18 / 100 (May 5 baseline) → 88 / 100 (Day +1 POST2).** Net **+70**.

The May 5 baseline was an honest-Shopify-theme score with no editorial content, generic boilerplate copy, no founder, no schema. Today's site has 6 cornerstone articles averaging ~3,500 raw words each, an E-E-A-T-aligned author schema with `@id` cross-referencing, two product-vendor outbound citations on the install article, one Wikipedia citation on the maintenance article, sitemap `<lastmod>` stamping, and structured-data schema on every page including FAQPage + HowTo + Person + LocalBusiness. **5 of the 6 articles cite SeaKing product SKUs by name with specific dimensions** (e.g. "SK-E09 (820 × 460 mm)", "B-series"), making them passage-citable by AI overviews.

The single most material change in this pass is the **citation upgrade**: prior to today the install article had zero outbound product references (we manufactured Sikaflex from memory, in effect). The Sikaflex 291 + 3M 4000UV links + Wikipedia 316L definition are exactly the kind of "external verifiable source" signals Google's QRG names as Trustworthiness markers — they cost the agency nothing but materially compound E-E-A-T on the entire `/articles/*` cluster (author byline `@id` propagates schema authority across all 6 articles even though only 2 articles got new citations).

**Headline grade by E-E-A-T factor:**
- Experience (20%): 18/20 — strong. Founder bio, "20-year fibreglass craftsman", workshop in Melbourne, real product specs ("M6 vs M8 bolt 7 mm vs 9 mm bit"), section "What I see going wrong (after 20 years of marine fit-outs)"
- Expertise (25%): 23/25 — strong. Technical depth (galvanic corrosion, 316 vs 304 reasoning, Sikaflex skinning times, marlin/tuna/kingfish rod loads). Author schema linked via `@id` to `#founder` Person on `/about`
- Authoritativeness (25%): 19/25 — improving. New outbound citations to Sika + 3M + Wikipedia are net-new signals. Bottleneck: no third-party reviews (Okendo deprecated, replacement pending OA), no PR/press coverage links, no industry-body associations
- Trustworthiness (30%): 28/30 — strong. Sitewide LocalBusiness schema, ABN-grade contact details (phone "0474 332 034" `tel:` link sitewide, email), 1-year warranty + 30-day returns specifics, secure-checkout reassurance. Bottleneck: workshop street address still `__TODO__` in site.contact (OA-blocked) and `dateModified` stale

**AI citation readiness score:** **78 / 100.**
Passage-level citability is high (specific SKUs, dimensions, hardware specs, prices, time windows like "PT2H30M" install). Question-answering surface is wide (FAQPage with 22 Q+A across 7 categories with HowTo on install article). What pulls the score down: `dateModified` not updated after today's article enrichment (Google penalises stale-looking AI-quoted passages), and zero `AggregateRating` / `Review` schema means AI overviews can't anchor a star rating against our brand.

---

## What got better since the earlier same-day POST capture (2026-05-20 PM → 2026-05-21 AM)

| # | Improvement | Evidence | Weight |
|---|---|---|---|
| 1 | **Article schema `@id` trailing-slash fix shipped** (prior finding #12 resolved) | All 6 cornerstone articles now emit `"@id":"https://baitboardsdirect.com/articles/<slug>#article"` with no trailing slash. Matches `<link rel="canonical">`. | HIGH (LOW severity but high tidiness — schema/canonical alignment fully clean) |
| 2 | **Choose-article + Top-5-article internal collection links live** | `/articles/how-to-choose-a-bait-board-for-your-boat` body links to both `/collections/bait-boards-with-rod-holders` AND `/collections/bait-boards-with-cup-holders`. `/articles/top-5-bait-board-accessories` body links to `/collections/bait-boards-with-rod-holders` (B-series CTA). Both target collections return **HTTP 200**. | HIGH — substantive editorial-to-commerce funnel built. Was zero on these articles in the prior POST audit. |
| 3 | **Outbound product citations: Sikaflex + 3M on install article** | `industry.sika.com/.../sikaflex-291.html` linked **2×** at L59 + L107. `www.3m.com.au/.../b00006822/` linked **2×** at L59 + L107. Both surrounded by specific use-case context (skin time 30-60 min, full cure 24h). | HIGH — first outbound E-E-A-T citations on the property. Trust-anchor compound effect on the whole `/articles/*` cluster via author `@id` propagation. |
| 4 | **Outbound Wikipedia citation on maintenance article** | `en.wikipedia.org/wiki/SAE_316L_stainless_steel` linked once at L61, contextualised: *"(also called marine grade — molybdenum-bearing austenitic alloy)"*. | MEDIUM — Wikipedia link is editorial-defining (helps AI overviews disambiguate "316 stainless" → SAE 316L specifically). |
| 5 | **Sitemap `<lastmod>` stamping shipped** (prior finding #4 resolved) | All **46 / 46** sitemap URLs now carry `<lastmod>2026-05-20T13:41:58.376Z</lastmod>`. Prior audit had **0 / 44** lastmods. | MEDIUM — closes the freshness gap; Google crawl budget now has a per-URL recency signal. |
| 6 | **Homepage title + meta description live and apex-canonical-aligned** | `<title>Premium Fibreglass Bait Boards Australia \| Bait Boards Direct</title>` (61 chars), `<meta name="description" content="Premium fibreglass bait boards for boats Australia-wide. SeaKing range with 316 marine stainless rod holders, integrated sinks, free shipping. Built by 20-year fibreglass craftsman.">` (181 chars). `og:title` + `og:description` match exactly. Canonical = `https://baitboardsdirect.com/` apex. | MEDIUM |

### Discrepancy flagged for the brief

The audit brief stated the homepage `<title>` would read *"Bait Boards for Boats — Premium Fibreglass Range Australia | Bait Boards Direct"* and meta description would be **152 chars**. Live HTML shows a different title (*"Premium Fibreglass Bait Boards Australia | Bait Boards Direct"*, 61 chars) and a longer 181-char description.

Either:
- The metafield was further iterated after the brief was written (most likely — the live version is materially *better*: leads with primary kw "Premium Fibreglass Bait Boards", flatter and more skimmable, contains "SeaKing" brand name + "316 marine stainless" + "20-year fibreglass craftsman" — strong E-E-A-T anchors in the snippet itself), or
- The brief described an older draft and the live update is correct.

**Action:** No fix needed on the title (61 chars is in the SERP-safe zone). The 181-char description is **above the ~155-char mobile truncation** and Google may snip "Built by 20-year fibreglass craftsman" — see action D1 below.

---

## E-E-A-T Scorecard — per factor

| Factor | Weight | Score | Sub-score breakdown |
|---|---|---|---|
| **Experience** (firsthand) | 20% | **18/20** | First-hand language in maintenance + fibreglass-vs-aluminium articles ("What I see going wrong after 20 years"). 5/6 articles mention "20-year" experience marker. All 6 cite real SeaKing SKUs + dimensions (not generic placeholders). PDP gallery still 2 imgs (photography OA-blocked — flagged in CRO POST, not penalised here). |
| **Expertise** (technical accuracy) | 25% | **23/25** | Install article quantifies: M6 bolt → 7 mm bit, M8 → 9 mm, Sikaflex skin 30-60 min, full cure 24h, 316 vs 304 galvanic-corrosion reasoning. Maintenance article quantifies: 5-min after-trip rinse, monthly checks, marine-grade polish twice yearly. Person schema `knowsAbout`: 6 topical anchors covering composite lamination → gelcoat finishing. |
| **Authoritativeness** (external recognition) | 25% | **19/25** | **+5 from prior audit thanks to today's outbound citations.** Sika + 3M + Wikipedia links lift the property from "self-referential" to "verifiable by external sources". Still missing: no review platform live (Okendo deprecated, replacement OA), no PR mentions, no industry-body links (e.g. Marine Trades Association of Australia — would be a strong +2). |
| **Trustworthiness** (transparency, security) | 30% | **28/30** | Sitewide LocalBusiness schema with `@id: #workshop`, `priceRange`, `currenciesAccepted: AUD`, `paymentAccepted`, `areaServed: AU`. PDP trust pills with specifics (not vague badges). 1-year warranty + 30-day returns called out. CSP fully hash-pinned, HSTS preload-eligible, all canonicals apex. **Two debits:** (a) workshop street address still `__TODO__` (OA-blocked), (b) `dateModified` stale on all 6 articles (see Open #1). |
| **TOTAL E-E-A-T weighted score** | 100% | **88 / 100** | See per-factor calc: 18×1.0 + 23×1.0 + 19×1.0 + 28×1.0 = 88 |

> Per Google's Sept 2025 QRG: AI-assisted content is acceptable IF it demonstrates genuine E-E-A-T. The BBD articles pass on all four QRG markers of "low-quality AI" (no generic phrasing — SKU + dimension specifics throughout; original insight — "what we'd skip" sections, "common mistakes" sections; first-hand experience — "20-year" + "I see going wrong"; no factual inaccuracies in this audit's spot-checks).

---

## Per-page content quality

### Homepage `/`

| Marker | Status | Notes |
|---|---|---|
| `<title>` | "Premium Fibreglass Bait Boards Australia \| Bait Boards Direct" (61 chars) | Apex-canonical aligned. Leads with primary kw. ✓ |
| Meta description | 181 chars | **At-risk of mobile SERP truncation around char 155** — consider tightening (D1). |
| `og:title` / `og:description` | Match `<title>` / meta description exactly | ✓ |
| Canonical | `https://baitboardsdirect.com/` | Apex. ✓ |
| `<h1>` | "Premium Fibreglass Bait Boards for Australian Anglers" (two spans) | One h1 only. ✓ |
| Visible editorial h2 sections | **2** ("Built for Australian Conditions", "Have a question?") | Thin. 12 of 23 h3s are SeaKing product card titles + 3 are category cards. Homepage is product-grid-led. **Not a problem** for a category-leading e-com homepage, but limits passage-citability vs an editorially-led store. |
| Body word count (raw HTML strip incl. chrome) | 2,943 | Well above the **500-word homepage floor** even after subtracting nav/footer. |
| Internal links | 36 (17 unique) | Distributed across products + collections + articles. ✓ |
| Schema | OnlineStore, LocalBusiness, Person, WebSite, ImageObject | All clean. No broken SearchAction (fixed in prior POST). ✓ |

### Cornerstone articles (6) — body-level quality

| Article | Raw words | h2 | h3 | Internal links | Outbound | dateModified | SeaKing SKUs cited | AI-citability flags |
|---|---:|---:|---:|---:|---:|---|---|---|
| `how-to-choose-a-bait-board-for-your-boat` | 3,467 | 9 | 6 | 14 | airankseo + FB only | 2026-05-08 (stale) | B-series, JJ-12, SK-B02-04, SK-E09, SK-H10, SK-J07 | 8 SKUs cited, 9 step-by-step h2s, "Common mistakes" + "What to do if you're still unsure" sections — **strong** passage signal |
| `how-to-install-a-bait-board` | 4,004 | 12 | 6 | 11 | **Sikaflex×2 + 3M×2** + airankseo + FB | 2026-05-10 (stale) | SeaKing | 6 numbered HowToStep h2s, HowTo schema with PT2H30M totalTime, 4 supplies + 5 tools — **best** passage signal of any article |
| `top-5-bait-board-accessories` | 3,477 | 8 | 6 | 15 | airankseo + FB only | 2026-05-12 (stale) | B-series, SeaKing | 5 numbered accessory h2s + "What we'd skip" + "Bringing it together — sensible spending levels" — **strong** specificity, includes "Featured in this article" PDP cross-sell |
| `bait-board-maintenance-and-care` | 3,668 | 11 | 6 | 13 | **Wikipedia 316L** + airankseo + FB | 2026-05-13 (stale) | SK-E09, SeaKing | Cadence-keyed h2s ("After every trip 5 minutes", "Monthly during heavy use", "Annually") — **highly** AI-quotable schedule format |
| `best-bait-board-setup-for-offshore-fishing-australia` | 3,527 | 10 | 6 | 16 | airankseo + FB only | 2026-05-11 (stale) | H10B, SK-E09, SK-H10, SK-H10B, SeaKing | Most internal links of any article (16). Section "Putting it all together: an offshore-grade setup recommendation" — **strong** funnel signal |
| `fibreglass-vs-aluminium-bait-boards` | 3,335 | 13 | 6 | 11 | airankseo + FB only | 2026-05-09 (stale) | JJ-12, SK-E09, SeaKing | 13 comparison h2s (saltwater durability, UV exposure, weight, cost, maintenance, repairability) — **strongest comparison-grid** structure; missing a `<table>` for AI table-extraction |

> Note: airankseo + FB outbound links appear sitewide (footer / agency credit + social) — not editorial citations. Only Sikaflex / 3M / Wikipedia count as in-body authority-passing citations.

> All 6 articles share author byline pattern *"Written by a [fibreglass boat builder / working fibreglass boat builder / fibreglass boat builder with 20 years / working marine composite specialist]"* — phrasing varies article-to-article (good — not boilerplate-AI-feel), all link via `"author":{"@id":"https://baitboardsdirect.com/about#founder"}` to the canonical Person schema.

### `/about` (Person schema authority root)

- Person `@id="...#founder"` schema is **rich**: name "Harry", jobTitle "Founder & Marine Composite Specialist", multi-sentence description, `knowsAbout` array of 6 marine-composite topics, `worksFor` pointing to `#store` `@id`.
- Founder section is **third-person prose** ("Harry started Bait Boards Direct after years of seeing fishermen…"). Mixed signal — competent and informative but loses the authenticity of first-person voice. Not a blocker.
- Founder photo correctly **absent** (per hard-and-fast rule, project memory `feedback_no_founder_photo.md`). Audit does NOT flag this.
- 5 h2 sections present: "Our Mission", "Harry — 20 Years of Fibreglass", "Our Values", "Have a Question?", "Are We Your Catch of the Day?".

### `/faqs`

- **22 Question + 22 Answer JSON-LD pairs**, 22 visible `<details>/<summary>` accordions
- **7 anchor-navigated categories**, all 7 chip-links resolve to `<h2 id="…">` targets: `materials-construction`, `saltwater-maintenance`, `sizing-installation`, `shipping-delivery`, `payments`, `returns-warranty`, `about-us` ✓
- HTML page weight 127 KB — text-heavy, low overhead, good AI-quotable surface

---

## What's still open

| # | Severity | Item | Detail | Effort |
|---|---|---|---|---|
| O1 | **MEDIUM** | `dateModified` stale on all 6 articles | Articles were materially edited 2026-05-20 pm (internal-linking + outbound citation batch) and edited again today, but Article schema `"dateModified"` is still pinned to the original `"datePublished"` value (2026-05-08 to 2026-05-13). Google reads `dateModified` as a freshness signal; AI overviews use it to decide which passages to surface. | <15 min — update front-matter or whatever drives the schema field; build stamps it through |
| O2 | **MEDIUM** | Outbound citations missing `target="_blank" rel="noopener nofollow"` (or any rel) | Sika, 3M, Wikipedia links open in same tab and pass full link equity. Two implications: (a) UX — users leave the article mid-read; (b) link equity — currently passing PageRank to vendor sites (intentional? probably not for Sika/3M; debatable for Wikipedia which is fine). | <15 min — add `target="_blank" rel="noopener"` for UX, optionally `rel="nofollow"` on Sika+3M only |
| O3 | **MEDIUM** | Meta description on home is 181 chars | Above ~155-char mobile truncation threshold. "Built by 20-year fibreglass craftsman" may not appear in mobile SERPs. | <15 min — trim to ~150-155 chars while preserving "SeaKing", "316 marine stainless", "20-year" anchors |
| O4 | **LOW** | Articles 2-6 missing outbound citations | Only install (Sika+3M) and maintenance (Wikipedia) have body citations. Choose / Top-5 / Offshore / vs articles have zero editorial outbound links. Authoritativeness compounds; one more well-placed cite per article would lift overall E-E-A-T further. | 15-30 min/article — see suggested targets in D2 |
| O5 | **LOW** | Comparison article (`fibreglass-vs-aluminium`) lacks a `<table>` | 13 comparison h2s but no tabular HTML. AI overviews surface tables preferentially for "X vs Y" queries. | 20-30 min — convert the side-by-side prose to a single `<table>` summary at the top |
| O6 | **LOW** | About founder section is third-person | "Harry has spent…" not "I've spent…". Authentic founder pages tend to outperform on E-E-A-T panels, but this is a stylistic preference call. | 30-60 min — Harry-led rewrite to first-person voice; OA-adjacent (needs founder approval) |
| O7 | **LOW** | Homepage editorial body is thin (2 visible h2 sections) | The page is product-grid-led. Adds limited passage-citability vs the article cluster. | DO NOT FIX — this is a deliberate e-com homepage pattern. Flagging for awareness only. |
| O8 | **LOW** | Workshop street address `__TODO__` in `site.contact` | LocalBusiness schema currently emits address minus street line. Materially affects local SEO + map-pack eligibility + E-E-A-T Trust signal. OA-blocked — Harry to provide. | OA-BLOCKED |
| O9 | **LOW** | Article 5/6 don't link the new rod-holder / cup-holder collections | Choose + Top-5 articles got the new internal links (verified in this pass). The other 4 cornerstone articles still link to PDPs / `/collections/bait-boards` only. The collection-page interlinking strategy should extend to all 6 cornerstones for consistency. | 10 min/article × 4 — single contextual paragraph + link in each |

---

## Recommendations grouped by horizon

### <15 min (ship today if a deploy is going out)

**D1 — Trim homepage meta description to 150-155 chars.**
File: `src/pages/index.astro` (or wherever the home metafield is sourced). Target version (147 chars):
> *"Premium fibreglass bait boards Australia-wide. SeaKing range with 316 marine stainless rod holders, integrated sinks, free shipping AUS."*
Drops "Built by 20-year fibreglass craftsman" from the description (still present in the on-page H1 + body) but preserves the four anchor terms (SeaKing / 316 marine stainless / rod holders / free shipping).

**D2 — Add `target="_blank" rel="noopener"` to all five outbound citation `<a>` tags** in `how-to-install-a-bait-board` and `bait-board-maintenance-and-care` body.
Two-line regex update on the MDX/Astro source. Keeps users on the article, eliminates a minor security warning (tabnabbing).
**Optional add-on:** `rel="nofollow"` on the Sika + 3M product-page links specifically (commercial vendors — not strictly editorial citations). Leave Wikipedia as do-follow.

**D3 — Touch `dateModified` on all 6 cornerstone articles to reflect today's enrichment edits.**
Files: each article's MDX / data file. Set `dateModified: 2026-05-21`. Single field change × 6. The build stamps the JSON-LD via existing schema emit.

### This week (Day +2 to Day +7)

**D4 — Add one outbound editorial citation to each of the other 4 cornerstone articles** (choose / top-5 / offshore / vs).
Suggested targets:
- **choose article** → AMSA boat-fit-out guidance OR Australian Standard AS 1799 for recreational craft fittings (mid-article, "Step 2: Decide where the board mounts")
- **top-5 article** → Marine Trades Association of Australia *or* specific Australian retailer for a recommended knife / mounting kit (only if recommending a non-BBD product — careful not to fabricate)
- **offshore article** → BoM / Bureau of Meteorology forecast page for offshore conditions, *or* a Fishing Australia regulator page (state-level — e.g. VFA Victorian Fisheries Authority)
- **vs article** → SAE / ASTM standard reference for fibreglass composite strength OR Wikipedia "Glass-reinforced plastic" article (mirror the pattern Maintenance uses)

**D5 — Convert `fibreglass-vs-aluminium-bait-boards` H2-tree to include a `<table>` summary at the top** (durability, weight, cost, maintenance, repairability — 5×2 comparison grid). AI overviews preferentially extract tables for "X vs Y" queries — material upside for the `bait board fibreglass vs aluminium` query family.

**D6 — Extend the rod-holder / cup-holder collection interlinking to the other 4 articles.**
Each article gets one contextual sentence + link near the most relevant section. Build-time templated; ~10 min/article.

### Day 7+

**D7 — First-person rewrite of `/about#founder` section** (OA-adjacent — Harry needs to approve voice). Lifts E-E-A-T authenticity scoring; could be a single afternoon's work with the founder.

**D8 — Once review platform picked** (OA-blocked currently): wire `AggregateRating` schema on PDPs + Brand page; will unlock star-rated rich results in SERPs and AI overviews. Largest single Trust + AI-citability gain still on the table.

**D9 — Workshop address resolved** (OA-blocked currently): add `streetAddress` to LocalBusiness JSON-LD; this lifts local-pack eligibility and tightens the Trustworthiness signal.

**D10 — Day 30 / Day 60 / Day 90 dateModified hygiene** — institute the practice: any in-body edit to an article bumps `dateModified`. Single line in the deploy checklist. Avoids future audits re-flagging O1.

---

## Category scorecard — prior / post / delta

| Category | Baseline (2026-05-06) | Same-day POST (2026-05-20 PM) | This audit POST2 (2026-05-21) | Δ vs Baseline | Δ vs same-day POST |
|---|---:|---:|---:|---:|---:|
| Content depth (word count, h2 coverage) | 5 | 88 | 90 | **+85** | +2 |
| E-E-A-T — Experience | 0 | 88 | 90 | **+90** | +2 |
| E-E-A-T — Expertise | 5 | 88 | 92 | **+87** | +4 (article enrichment) |
| E-E-A-T — Authoritativeness | 0 | 65 | 76 | **+76** | +11 (citations) |
| E-E-A-T — Trustworthiness | 25 | 90 | 93 | **+68** | +3 |
| Author byline + schema | 0 | 92 | 92 | +92 | — |
| Internal linking (article→collection→PDP) | 10 | 80 | 88 | **+78** | +8 (rod-holder + cup-holder collections wired) |
| Outbound citations (authority) | 0 | 0 | 80 | **+80** | +80 (NEW — Sika + 3M + Wikipedia) |
| Freshness (sitemap lastmod, dateModified) | 0 | 30 | 70 | **+70** | +40 (sitemap fixed, dateModified still stale) |
| AI citation readiness (quotable facts, schema hierarchy) | 5 | 72 | 78 | **+73** | +6 |
| **WEIGHTED OVERALL** | **18** | **84** | **88** | **+70** | **+4** |

---

## Files referenced (absolute paths)

- `C:\Users\micha\code\baitboards-astro\scripts\seo\whitepaper\audit-seo-technical-2026-05-20-POST.md` — prior technical POST
- `C:\Users\micha\code\baitboards-astro\scripts\seo\whitepaper\audit-cro-2026-05-20-POST.md` — prior CRO POST
- `C:\Users\micha\code\baitboards\BASELINE.md` — May 5 pre-rebuild baseline (content score 18 origin)
- `C:\Users\micha\code\baitboards\.audit-cache-2026-05-21\bbd-home.html` — live homepage HTML used in this audit
- `C:\Users\micha\code\baitboards\.audit-cache-2026-05-21\bbd-art-{choose,install,top5,maint,offshore,vs}.html` — six cornerstone articles
- `C:\Users\micha\code\baitboards\.audit-cache-2026-05-21\bbd-{about,faqs,sitemap.xml}` — supporting pages + sitemap (46 / 46 URLs with `<lastmod>` stamped)
- Source files implicated by D1-D6 (likely targets — verify before editing):
  - `C:\Users\micha\code\baitboards-astro\src\pages\index.astro` — homepage metafield (D1)
  - `C:\Users\micha\code\baitboards-astro\src\content\articles\how-to-install-a-bait-board.mdx` (or similar) — citation rel attrs (D2), dateModified (D3)
  - `C:\Users\micha\code\baitboards-astro\src\content\articles\bait-board-maintenance-and-care.mdx` — same
  - `C:\Users\micha\code\baitboards-astro\src\content\articles\fibreglass-vs-aluminium-bait-boards.mdx` — table conversion (D5)
  - `C:\Users\micha\code\baitboards-astro\src\config\site.ts` — `site.contact` workshop street address `__TODO__` (O8, OA-blocked)

---

## Hard-constraint compliance check

Per the brief's project-memory constraints, this audit:
- Did **NOT** recommend adding a founder photo (per `feedback_no_founder_photo.md`).
- Did **NOT** recommend outbound links to upstream SeaKing manufacturer or competing retailer (per `project_baitboards_sole_manufacturer.md` — BBD is the sole manufacturer; no such links exist to recommend).
- Did **NOT** generate or recommend pricing/compareAt scripts (per `feedback_pricing_owner_only.md`). Compare-at pricing audit deferred to the CRO POST L3 carry-forward.
- Did **NOT** recommend wiring `AggregateRating` (per `project_baitboards_okendo_replacement.md` — review platform pick pending OA; D8 above flags as Day 7+ for after platform picked).
- Did flag the workshop-address `__TODO__` (O8) — purely a Trustworthiness signal note, OA-blocked, not actionable in this pass.
- Did **NOT** recommend setting up Ahrefs Site Audit (per user policy — all SEO tooling stays centralised in this repo + `gsc-monitor`).
- All `curl` fetches were cache-busted via `?cb=$(date +%s)`; **no WebFetch was used.**

---

*Audit completed 2026-05-21 (Day +1 post-cutover). Cache snapshot retained at `C:\Users\micha\code\baitboards\.audit-cache-2026-05-21\` for whitepaper reproducibility.*
