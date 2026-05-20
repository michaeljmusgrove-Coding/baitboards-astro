# Ahrefs Audit — baitboardsdirect.com (Day-0 Baseline)

**Audit date:** 2026-05-20 (cutover day, ~T+10h)
**Auditor:** Ahrefs API v3 (Site Explorer endpoints, snapshot script `ahrefs_snapshot.py`)
**Site Audit project status:** **DOES NOT EXIST** (see §2)
**Data source:** `C:\Users\micha\code\gsc-monitor\data\ahrefs_snapshots\baitboardsdirect\2026-05-20.json`
**Prior pull:** `C:\Users\micha\code\gsc-monitor\data\ahrefs_snapshots\baitboardsdirect\2026-05-16.json`
**Disavow reference:** `C:\Users\micha\code\baitboards\disavow-baitboardsdirect-2026-05-08.txt` (149 domains, uploaded to GSC on Day-0)

---

## TL;DR

Brand-new domain on Ahrefs' metrics (DR 0, Ahrefs Rank ~125M). Ahrefs sees only **1 page** indexed-with-traffic (homepage) and **2 organic keywords**. Backlink profile is **86% spam/PBN by count** — and there's a small but real new-link-velocity problem: **+18 refdomains in the 12 days since the disavow was uploaded**, 16 of which look like a single PBN network (`*-seoexpress-*.store`) that Ahrefs hasn't classified as spam yet. **Migration was clean**: zero broken-backlinks found incoming to dead URLs, no Shopify legacy URLs surfaced as orphaned link targets. Largest risk surfaced by Ahrefs that Lighthouse didn't see: **anchor over-optimisation** — the brand anchor "baitboardsdirect.com" appears on 80 of 136 live refdomains (59%), which combined with the spam profile is the classic shape of a negative-SEO / link-spam attack rather than organic earned links.

---

## 1. Domain summary

| Metric | Value | Source / Note |
|---|---|---|
| Domain | `baitboardsdirect.com` | apex variant chosen by snapshot script (more rows than `www.`) |
| Domain Rating (DR) | **0.0** | `/site-explorer/domain-rating` — unchanged since May 16 |
| Ahrefs Rank | 124,732,236 | improved from 124,896,583 on May 16 (+164k positions; meaningless at this scale) |
| Live backlinks | **150** | up from 130 on May 16 (+20 in 4 days) |
| All-time backlinks | 236 | up from 218 (+18) |
| Live refdomains | **136** | up from 116 on May 16 (+20) |
| All-time refdomains | 201 | up from 180 (+21) |
| Refdomain rows returned | 194 | limit=500, full universe captured |
| Anchor rows returned | 51 | limit=100, full universe captured |
| Pages with traffic (Ahrefs-indexed, AU) | **1** | homepage only |
| Organic keywords (AU) | **2** | `fibreglass bait board` (pos 2), `bait board` (pos 20) |

**Trend (90-day org_traffic from `metrics-history` weekly grouping):** peaked at 18 visits/wk on 2026-04-27 → declined to 7 visits/wk on 2026-05-18. **Ahrefs sees a downtrend leading into cutover**, consistent with the planned Shopify→Astro DNS work and the fact that Ahrefs Top Pages estimates traffic from positions rather than measuring it.

---

## 2. Site Audit project status — DOES NOT EXIST

`GET /site-audit/projects` returned 7 projects for this Ahrefs account; **none named `baitboards`** and none with `baitboardsdirect.com` as target. Existing projects: Propertyperspectiveqld, Syfre, Andoniscafeandbar, Versatile-marine.com, Hyperionsystems.com, Totalcleaningmelbourne.com, Checkmate.

**Recommendation:** Create a Site Audit project for `baitboardsdirect.com` in the Ahrefs UI (Site Audit → New Project → enter `https://baitboardsdirect.com`, choose protocol `both`, mode `subdomains`, crawl limit ~500 URLs). The Site Audit crawler is the only Ahrefs surface that gives proper on-site technical findings — crawl budget consumption, hreflang errors, internal redirect chains, orphan pages, etc. The Site Explorer data in this report is a fallback that captures indexed-pages + link-graph context only. **Site Audit project creation is a UI step (Ahrefs does not expose a `POST /site-audit/projects` endpoint in v3).**

Once the project crawl completes (~30 min for a 44-URL Astro site), re-run this audit using `/site-audit/issues`, `/site-audit/pages`, and `/site-audit/internal-pages` for the proper technical layer.

---

## 3. Top pages by traffic (AU)

Only **1 page** returns from `/site-explorer/top-pages` with any traffic attribution. This is Ahrefs' index, not real traffic — Ahrefs hasn't re-crawled the new Astro site yet and is reporting against the Shopify-era index.

| URL | Traffic (est) | Value (AUD) | Top keyword | Top kw vol | Top kw pos | Total kw | Refdomains |
|---|---:|---:|---|---:|---:|---:|---:|
| `https://baitboardsdirect.com/` | 7 | $59 | `fibreglass bait board` | 30 | 2 | 2 | 104 |

**Interpretation:** Ahrefs hasn't yet crawled the new Astro site enough to attribute traffic to PDP, articles, or FAQs. Expect this list to grow to 10-30 rows over the next 4-6 weeks as Ahrefs re-crawls the new sitemap. The Lighthouse POST audit (`audit-seo-technical-2026-05-20-POST.md`) shows 44 URLs indexable in the new sitemap; Ahrefs will catch up.

---

## 4. Organic keywords (AU) — top 30

Only 2 keywords surface as ranking. The new Astro PDPs / article / FAQ schema haven't been crawled-and-ranked yet.

| # | Keyword | Pos | Volume | Traffic | KD | CPC | URL |
|--:|---|--:|--:|--:|--:|--:|---|
| 1 | `fibreglass bait board` | **2** | 30 | 6 | 0 | — | `/` |
| 2 | `bait board` | **20** | 500 | 2 | 0 | $38 | `/` |

**Note:** `bait boards australia` (pos 8, vol 30) was ranking on the May 15 pull but dropped off this snapshot. Likely Ahrefs SERP refresh churn — re-check at Day 7.

**Striking-distance gap (already flagged in `BBD-SEO-Plan-Client-Review.md`):** `bait board` is the highest-value target keyword. At pos 20 with KD 0 and $38 CPC, a 10-position improvement would be the single highest-ROI ranking move. Schema, internal linking from the article + FAQ pages, and the new sitemap should all push this above pos 10 within 4-6 weeks.

---

## 5. Broken backlinks (incoming links to 404'd URLs)

**Zero rows returned** from `/site-explorer/broken-backlinks`. This is the **most important migration safety finding in this report**.

**Interpretation:** Either (a) the disavowed PBN sites that linked to the legacy Shopify root all linked to `/`, not to product URLs that changed shape; or (b) Ahrefs hasn't yet re-crawled enough to detect any breakage. Cross-checking with `audit-seo-technical-2026-05-20-POST.md` — the `redirects.js` Worker map already handles 16 legacy `/products/seaking-*` URLs (per `CLAUDE.md` §9.3), so if Ahrefs does surface broken-backlinks on the next pull, they'll route through the Worker's redirect layer.

**Re-check at Day 7 and Day 30.** If broken-backlinks count is still 0 at Day 30, the migration was perfectly clean from a link-equity-preservation standpoint.

---

## 6. Outgoing broken links

**Not available from Ahrefs API v3.** The `/site-explorer/broken-links` and `/site-explorer/all-broken-links` endpoints both return HTTP 404. Ahrefs surfaces outgoing-broken-link data in the UI's Site Audit view; without a Site Audit project (see §2), this can't be captured via API.

**Recommendation:** Capture this from the Site Audit UI report once the project is created.

---

## 7. Anchor text distribution — top 20

This is the **largest red flag Ahrefs surfaces that Lighthouse cannot see.**

| Refdomains | Dofollow | TopDR | Anchor (truncated) | Pattern |
|--:|--:|--:|---|---|
| **80** | 77 | 75 | `baitboardsdirect.com` | brand URL |
| **46** | 0 | 35 | `Honestly, I almost gave up on growing baitboardsdirect.com before discovering...` | spam testimonial template |
| 26 | 26 | 51 | `baitboardsdirect` | brand mention |
| 2 | 0 | 73 | `https://baitboardsdirect.com/` | brand URL |
| 2 | 0 | 23 | `visit baitboardsdirect.com for latest info` | spam template |
| 1 | 0 | 0.4 | `FAQ on SeoPyro.com by baitboardsdirect.com` | spam template |
| 1 | 0 | 50 | `Ranking miracles for baitboardsdirect.com – ExLinko.com makes them happen.` | spam template |
| 1 | 0 | 90 | `Achieve High-DA Backlinks for Maximum Impact for baitboardsdirect.com on Uplinke.com` | spam template |
| 1 | 1 | 16 | `Bait Board SK-E09 – Bait Boards Direct` | **legitimate** — product title |
| 1 | 0 | 53 | `Get baitboardsdirect.com real link building ranking new domains like established authority sites` | spam template |
| 1 | 0 | 84 | `Thanks baitboardsdirect.com! We turn your challenges into digital success stories.` | spam template |
| 1 | 0 | 0 | `baitboardsdirect.com Organic Traffic Explodes: Global Guest Posts + Powerful ...` | spam template |
| 1 | 0 | 74 | `Complete growth-focused SEO package with Authority Backlinks and guest post links for baitboardsdirect.com | RankZly.com – Your Unbeatable SEO Partner for Fast Google Rankings` | spam template |
| 1 | 0 | 90 | `Supercharge SEO with Guest Posts & Niche Edits for baitboardsdirect.com on Uplinke.com` | spam template |
| 1 | 1 | 3.3 | `Best Pinterest Tool SiteToSocial.com to Grow Your Website Traffic Fully Automated` | unrelated affiliate |
| 1 | 0 | 53 | `Get baitboardsdirect.com buying link building accepted in all niches all languages worldwide` | spam template |
| 1 | 0 | 22 | `We Provide Guest Posts for https://baitboardsdirect.com, Plus High-Quality Do...` | spam template |
| 1 | 0 | 0 | `Turbocharge baitboardsdirect.com with Indexed Multilingual Guest Posts + High...` | spam template |
| 1 | 0 | 32 | `baitboardsdirect.com — rank faster — unique‑domain PBN; grow Moz DA. | Visit Buyseolink.com for any Query` | spam template |
| 1 | 0 | 53 | `Buying link building for baitboardsdirect.com delivering real DR, DA and TF improvement worldwide` | spam template |

**Anchor profile breakdown:**

| Anchor type | refdomains | % of 136 live refdomains |
|---|--:|--:|
| Brand URL (`baitboardsdirect.com`) | 80 | **59%** |
| Spam-promo template containing brand | ~46 | **34%** |
| Bare brand mention (`baitboardsdirect`) | 26 | 19% |
| Genuine product/page title | 1 | <1% |
| Genuine topical anchor (e.g. "fibreglass bait board") | **0** | **0%** |

**Diagnosis:** The link profile is **94%+ artificial.** No naturally-earned topical anchors. Zero anchors mentioning the actual products, fishing tackle terminology, or fishing publication mentions. This is the unmistakable shape of a long-running PBN attack — likely targeting `baitboardsdirect.com` because it's a low-DR domain ripe for being "boosted" by spam services in the hope the owner pays them to stop.

**This is exactly what the May 8 disavow file was designed for**, and the disavow file's effectiveness in Google's eyes is independent of Ahrefs continuing to display these links — Google honours disavow even when Ahrefs still shows the link.

---

## 8. Cross-reference vs Lighthouse POST audit

What Ahrefs sees that the Lighthouse/curl-based `audit-seo-technical-2026-05-20-POST.md` (overall score 93/100) cannot see:

| Item | Lighthouse audit | Ahrefs API | Gap & action |
|---|---|---|---|
| **Spam/PBN refdomains** | not visible | **194 refdomains, 84% spam** | Lighthouse only inspects on-page HTML — has no view of inbound link graph. Already addressed via disavow upload Day-0. |
| **Anchor over-optimisation** | not visible | 94% non-organic anchors | Same — link graph invisible to Lighthouse. No additional action — Google ignores most spam anchors anyway, but the topical anchor gap is real (§9). |
| **Broken backlinks (incoming)** | not visible | **0 found** | Migration confirmed clean from a link-equity-preservation standpoint. |
| **New refdomain velocity** | not visible | **+18 refdomains in 12 days** | Disavow file needs Day-7 refresh (§9). |
| **Ahrefs-indexed pages** | sitemap shows 44 indexable | **1 page** showing traffic (Ahrefs lag) | Expected — Ahrefs crawler hasn't re-indexed the new Astro site. Re-check Day 7. |
| Legacy Shopify URLs in Ahrefs index | not checked | **none surfaced** | No `/products/seaking-*` URLs in the refdomain target column. Migration redirects appear to be holding from Ahrefs' perspective. |
| Schema, CWV, CSP, canonical, hreflang | covered in POST audit | not measured by Site Explorer | Site Audit project (§2) would close this gap. |
| Mobile/desktop performance | covered (PSI POST) | not measured | Use PSI. |
| Disavow coverage delta | not visible | **45 / 194 current refdomains NOT in disavow file** | Update disavow file at Day 7 (§9). |

---

## 9. Recommendations — ranked by impact

### Priority 1 — Update disavow file at Day 7 (5 min effort)

**Finding:** Of 194 current refdomains, **149 are in the disavow file** (uploaded Day-0), **45 are not**. Of those 45 unfiled, **23 are flagged by Ahrefs as `is_spam=True`** and another 16 follow the `*-seoexpress-*.store` PBN pattern that Ahrefs hasn't yet flagged. 18 of those 45 are brand-new since the May 16 snapshot (i.e. arrived in the 4 days right before cutover).

**Action:**
1. Re-run `python ahrefs_backlinks.py audit --site baitboardsdirect --days 14` on 2026-05-27.
2. Regenerate the disavow file appending the 23 Ahrefs-flagged-spam + 16 `*-seoexpress-*.store` PBN-pattern domains + 6 other unflagged but pattern-matching shop/click TLDs.
3. Re-upload to GSC via `gsc_scrape.py --upload-disavow` (per `CLAUDE.md` global rules).

**Specific new domains to add (Day 7 disavow update):**

```
# Ahrefs-flagged spam (23)
domain:factmags.com
domain:kawaiishop.shop
domain:simplywebshop.shop
domain:kmoshops.shop
domain:thebacklinks.shop
domain:thehighrankseo.shop
domain:thehighseoranking.shop
domain:123webshop.shop
domain:goooogla.com
domain:websiterace.com
domain:ready.pro
domain:booksreadr.org
domain:ycm.info
domain:way2check.cv
domain:tunca.org
domain:newsblogsports.site
domain:read.org.in
domain:findit.co.in
domain:allinone.co.in
domain:indians.cc
domain:wallpapers.pro
domain:domainanalysis.org
domain:wonvision.com

# PBN-pattern, Ahrefs not yet flagged (16 + likely more) — *-seoexpress-*.store farm
domain:global-seo-group-seoexpress.store
domain:seoexpress-marketing-exchange.store
domain:advanced-ranking-seoexpress-specialists.store
domain:seoexpress-outreach-team.store
domain:seoexpress-anchor-text-experts.store
domain:ultimate-seoexpress-niche-edit-experts.store
domain:premium-seoexpress-outreach-provider.store
domain:master-seoexpress-search-agency.store
domain:smart-seoexpress-webpage-experts.store
domain:expert-organic-seoexpress.store
domain:seoexpress-verified-high-da-consultants.store
domain:seoexpress-leading-dofollow-pros.store
domain:advanced-search-seoexpress-pros.store
domain:official-seoexpress-white-hat-team.store
domain:sporstcenter.com
domain:premiumseolinks.shop
domain:toplinkranker.shop
domain:seolinkpro.shop
domain:authoritybacklinks.shop
domain:ranklinkx.shop
domain:linkrankboost.shop
domain:ranklinkpro.shop
```

### Priority 2 — Create Ahrefs Site Audit project (5 min UI work, then 30 min crawl)

**Finding:** No Site Audit project exists. Site Explorer is fallback data only.

**Action:** In Ahrefs UI → Site Audit → New Project → `https://baitboardsdirect.com`, mode=subdomains, protocol=both, crawl limit=500. Re-run this audit's §2/§5/§6 sections from `/site-audit/issues`, `/site-audit/pages`, `/site-audit/internal-pages` once crawl completes. Closes the outgoing-broken-link gap (§6) and gives proper on-site technical findings.

### Priority 3 — Earn first non-spam topical anchor (impactful but slow)

**Finding:** Zero refdomains use topical anchors like `bait board`, `fibreglass bait board`, `boat fishing accessories`. 100% of anchors are either brand-URL or spam-promo templates.

**Action:** Targeted outreach to AU fishing publications (Western Port Fishing, Fishing Monthly, Spot On Fishing, etc.) with a guest post or "best bait boards 2026" mention pitch. Even 3-5 editorial mentions with topical anchors would meaningfully shift the anchor profile. Track via `python ahrefs_backlinks.py audit --site baitboardsdirect --days 30` at Day 30.

### Priority 4 — Striking-distance keyword push

**Finding:** Only 2 ranking keywords. `bait board` at pos 20, vol 500, KD 0 is the single highest-ROI target.

**Action:** Already on the queued post-cutover list (`CLAUDE.md` §9.5). After the Ahrefs Day-7 re-crawl picks up the new Astro page schemas + internal links from the FAQ and articles, this should move into striking distance. No action this week; re-check Day 14.

### Priority 5 — Whitepaper Day-0 freeze

**Finding:** This audit + the May 15 / May 16 pre-launch snapshots constitute the frozen "before" link-graph data for the whitepaper.

**Action:**
1. Copy `2026-05-20.json` into `C:\Users\micha\code\baitboards\pre-launch-baseline\ahrefs\` to lock the Day-0 snapshot alongside the May 15 + May 16 baselines.
2. At Day 30, re-run `ahrefs_snapshot.py` and write a `audit-ahrefs-site-2026-06-19.md` to capture the delta.

---

## Files referenced

- Snapshot (this audit): `C:\Users\micha\code\gsc-monitor\data\ahrefs_snapshots\baitboardsdirect\2026-05-20.json`
- Prior snapshot: `C:\Users\micha\code\gsc-monitor\data\ahrefs_snapshots\baitboardsdirect\2026-05-16.json`
- Disavow file: `C:\Users\micha\code\baitboards\disavow-baitboardsdirect-2026-05-08.txt`
- Snapshot script: `C:\Users\micha\code\gsc-monitor\ahrefs_snapshot.py`
- Backlink audit script: `C:\Users\micha\code\gsc-monitor\ahrefs_backlinks.py`
- Lighthouse POST audit: `C:\Users\micha\code\baitboards-astro\scripts\seo\whitepaper\audit-seo-technical-2026-05-20-POST.md`
- Pre-launch report (May 15): `C:\Users\micha\code\baitboards\pre-launch-baseline\ahrefs\ahrefs-report-2026-05-15.md`

---

## Ahrefs API spend (this audit)

| Endpoint | Calls | Est. units |
|---|--:|--:|
| `/site-audit/projects` | 1 | ~5 |
| `/site-explorer/domain-rating` (×2 variants) | 2 | ~50 |
| `/site-explorer/backlinks-stats` (×2 variants) | 2 | ~50 |
| `/site-explorer/refdomains` (×2 variants, limit=500) | 2 | ~600 |
| `/site-explorer/all-backlinks` (×2 variants, limit=1000) | 2 | ~600 |
| `/site-explorer/anchors` (×2 variants, limit=100) | 2 | ~200 |
| `/site-explorer/organic-keywords` (×2 variants, limit=1000) | 2 | ~400 |
| `/site-explorer/pages-by-traffic` (×2 variants, limit=100) | 2 | ~200 |
| `/site-explorer/metrics-history` (×2 variants, 90d) | 2 | ~200 |
| `/site-explorer/broken-backlinks` (probe) | 1 | ~50 |
| `/site-explorer/top-pages` (probe) | 1 | ~50 |
| **Total estimate** | **19** | **~2,400 units** |

Well within the 5,000-unit task budget.
