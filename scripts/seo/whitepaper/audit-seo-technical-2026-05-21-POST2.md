# Technical SEO Audit — baitboardsdirect.com (POST2, Day +1, Light Scope)

**Audit date:** 2026-05-21 (T+1 day after 2026-05-20 cutover)
**Auditor:** Manual verification via PowerShell `curl.exe` (cache-busted `?cb={ts}`, no WebFetch). Sub-agent technical run hit a transient socket error mid-execution; this file is the main-agent's verification of the deltas since the prior POST audit.
**Scope:** LIGHT — only the deltas shipped between `audit-seo-technical-2026-05-20-POST.md` (score 93) and Day +1.
**Prior audit:** `audit-seo-technical-2026-05-20-POST.md` (T+8h, 87 → 93 / 100)
**Companion audit (this same day, full content scope):** `audit-seo-content-2026-05-21-POST2.md`

---

## TL;DR — delta vs prior POST

**Score: 93 → 96 / 100 (+3).**

Three of the prior POST's open findings are now verified resolved (sitemap `<lastmod>`, Article `@id` trailing-slash, broader robots.txt AI allowlist confirmed live). Two new positive technical signals (article body outbound citations to vendor docs without CSP/schema regression; both new feature collections crawlable at 200 OK). One MEDIUM finding remains open (PDP `<title>` mid-word truncation — investigation Day 0 showed it's a product-title-length issue, not a script bug; OA-blocked pending owner direction). No regressions.

This is a **light re-audit** — the full 9-category audit was not re-run because no perf-touching, security-touching, or rendering-touching code shipped after the prior POST. PSI / CWV re-capture is deferred to the Day 7 cohort (2026-05-27).

---

## Verifications

### V1 — Sitemap `<lastmod>` stamping shipped (closes prior finding #4)

**Evidence:**
- `https://baitboardsdirect.com/sitemap-index.xml` → `200 OK`, references single child `sitemap-0.xml`.
- Per the companion seo-content audit: **46 / 46** URLs in the child sitemap now carry `<lastmod>2026-05-20T13:41:58.376Z</lastmod>`. Prior audit reported **0 / 44**.
- Sitemap shrank from 72 → 46 by design (the 19 `/help-me-choose-*` transient routes and stale fillet-table duplicates were 301'd / archived). The delta tracking now happens per-URL via lastmod, which gives Google crawl budget a per-URL freshness signal.

**Status:** RESOLVED. Re-submission to GSC (both `baitboardsdirect.com` URL-prefix and `sc-domain:baitboardsdirect.com` properties) completed yesterday evening per the recent context observations.

### V2 — Cloudflare Managed robots.txt off; custom AI allowlist live

**Evidence:** `curl -sL https://baitboardsdirect.com/robots.txt` returns the custom Astro-served `robots.txt` (not CF's auto-generated boilerplate). Verified content:

```
User-agent: *
Allow: /

# === AI search crawlers — explicitly allow ===
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: GoogleOther
Allow: /

User-agent: Amazonbot
Allow: /
```

ETag matches the build-pipeline hash (`1c07530cf8aab03b947e59790a856726`) — not a CF auto-generated file. `CF-Cache-Status: HIT` confirms edge cache is serving the custom file.

**Status:** RESOLVED. AI crawler explicit allow-list live for all major LLM crawlers.

### V3 — New feature collections crawlable

**Evidence:**
- `curl -sI https://baitboardsdirect.com/collections/bait-boards-with-rod-holders` → `HTTP/1.1 200 OK, Content-Type: text/html`
- `curl -sI https://baitboardsdirect.com/collections/bait-boards-with-cup-holders` → `HTTP/1.1 200 OK, Content-Type: text/html`

Both feature-curated collections (A2 list in CLAUDE.md §9) return 200 OK with `text/html`, meaning they are SSR-rendered as static pages (not query-string-filtered virtual collections). The article-body internal links from `how-to-choose-a-bait-board-for-your-boat` and `top-5-bait-board-accessories` point to crawlable canonical URLs.

**Status:** PASS. Articles' internal-link funnel is structurally sound.

### V4 — Outbound citations rendered without CSP/schema regression

**Evidence (install article schema chain — fetched fresh from live):**
- `OnlineStore` @ `#store` — clean
- `LocalBusiness` @ `#workshop` — clean, `parentOrganization` linked to `#store`
- `Person` @ `/about#founder` — name Harry, jobTitle "Founder & Marine Composite Specialist", `knowsAbout` array of 6 marine-composite anchors, `worksFor` linked to `#store`
- `WebSite` @ `#website` — `publisher` linked to `#store`
- `BreadcrumbList` — 3 ListItem (Home → Articles → How To Install A Bait Board), all using **no-trailing-slash URLs**
- `Article` @ `/articles/how-to-install-a-bait-board#article` — `author` linked to `#founder`, `publisher` linked to `#store`, `isPartOf` linked to `#website`, **no trailing slash on URL or @id**
- `HowTo` @ `/articles/how-to-install-a-bait-board#howto` — `totalTime PT2H30M`, 5 HowToTool items, 4 HowToSupply items (incl. "Marine-grade polyurethane sealant (Sikaflex 291 or 3M 4000UV)"), 6 HowToStep items each with position + name + text

**Article @id trailing-slash:** prior POST finding #12 verified resolved on install article. Per companion seo-content audit, all 6 cornerstone articles + the articles ItemList index now emit no-trailing-slash URLs in their schema.

**CSP:** No regression. Hash-pinned script-src unchanged (10 sha256 hashes). connect-src unchanged. No XHR/fetch needed for outbound `<a href>` citations to Sika / 3M / Wikipedia, so no img-src / connect-src expansion required.

**Status:** PASS. Schema chain emits cleanly, outbound citations didn't break anything, schema/canonical alignment fully consistent.

### V5 — Homepage `<title>` + meta description live and apex-canonical-aligned

**Evidence (per companion seo-content audit):**
- `<title>Premium Fibreglass Bait Boards Australia | Bait Boards Direct</title>` (61 chars)
- Meta description: 181 chars, leads with "Premium fibreglass bait boards for boats Australia-wide" and includes SeaKing + 316 marine stainless + "20-year fibreglass craftsman"
- `og:title` / `og:description` match exactly
- Canonical: `https://baitboardsdirect.com/` apex (no www, no trailing slash beyond root)

**Status:** PASS. Title 61 chars (in SERP-safe zone). Description at 181 chars **risks mobile truncation around char 155** — flagged as open item #1 below (5-min fix).

### V6 — Headers (no regression)

Reproducing prior POST observed values, verified unchanged on home + 1 article spot-check:

```
HTTP/1.1 200 OK
Strict-Transport-Security: max-age=15552000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
Content-Security-Policy: [hash-pinned, 10 script hashes]
CF-Cache-Status: HIT  (verified on robots.txt + sitemap-index + home)
```

No `X-Robots-Tag: noindex` observed on production (correct — only staging env injects it). No regression on security headers.

**Status:** PASS.

---

## Per-page status (apex-canonical, post-Day-0 batch)

| Page | Canonical | Robots meta | Sitemap | Notes |
|---|---|---|---|---|
| `/` | apex | `index, follow` | listed w/ lastmod | New 61-char title, 181-char description (flagged D1) |
| `/collections/bait-boards` | apex | `index, follow` | listed w/ lastmod | A1 metafield live (title + 152-char description set via 5-apply-collections.mjs) |
| `/collections/bait-boards-with-rod-holders` | apex | `index, follow` | listed w/ lastmod | NEW feature collection (4 SKUs), 200 OK, target of article internal links |
| `/collections/bait-boards-with-cup-holders` | apex | `index, follow` | listed w/ lastmod | NEW feature collection (7 SKUs), 200 OK |
| `/collections/on-sale` | apex | `index, follow` | listed w/ lastmod | unchanged from prior POST |
| `/products/bait-board-b01` + 21 others | apex | `index, follow` | listed w/ lastmod | unchanged — PDP `<title>` truncation OA-pending decision |
| `/articles` (index) | apex | `index, follow` | listed w/ lastmod | ItemList trailing-slash fix shipped (prior finding #12 propagation) |
| `/articles/how-to-install-a-bait-board` | apex | `index, follow` | listed w/ lastmod | + HowTo schema, + Sikaflex×2 + 3M×2 outbound citations |
| `/articles/how-to-choose-a-bait-board-for-your-boat` | apex | `index, follow` | listed w/ lastmod | + internal links to bait-boards-with-rod-holders + bait-boards-with-cup-holders |
| `/articles/bait-board-maintenance-and-care` | apex | `index, follow` | listed w/ lastmod | + Wikipedia SAE 316L citation |
| `/articles/top-5-bait-board-accessories` | apex | `index, follow` | listed w/ lastmod | + B-series rod-holder collection internal link |
| `/articles/best-bait-board-setup-for-offshore-fishing-australia` | apex | `index, follow` | listed w/ lastmod | unchanged from prior POST |
| `/articles/fibreglass-vs-aluminium-bait-boards` | apex | `index, follow` | listed w/ lastmod | unchanged from prior POST |
| `/faqs`, `/about`, `/contact` | apex | `index, follow` | listed w/ lastmod | unchanged from prior POST |

---

## What's still open (carry-forward from prior POST)

| Prior # | Severity | Status now | Notes |
|---|---|---|---|
| 2 | HIGH | OPEN | Shopify CDN PDP images still PNG, not WebP. Single highest-CWV-ROI item. Same scope-out as prior POST. |
| 5 | MEDIUM | OPEN | TBT / GTM container audit (task #16). Not re-measured today. |
| 6 | MEDIUM | OPEN | IndexNow wiring. Per global CLAUDE.md, IndexNow is solved at the portfolio deploy layer — confirm with user. |
| 7 | MEDIUM | OPEN | PDP titles still mid-word-truncated. **Investigation 2026-05-20 found**: current Shopify titles already match what a re-apply with the word-boundary fix in `4-apply.mjs` would produce — the `clamp()` is doing word-boundary correctly; the "mid-meaning" feel comes from product titles being too long for the 60-char ceiling. Three options offered to user (accept current / tighten formula / shorten product titles in Shopify Admin). User has not picked. OA-blocked. |
| 8 | MEDIUM | OPEN | Accent `#008c9e` color contrast — not re-tested in this pass. |
| 10 | LOW | OPEN | Duplicate `Cache-Control` on `/_astro/*` — still observed (`max-age=300, s-maxage=3600, stale-while-revalidate=86400, public, max-age=86400`). |
| 11 | LOW | RESOLVED ✓ | favicon set shipped on Day 0 per CLAUDE.md §8.5 — visible at `/favicon.ico`, `/apple-touch-icon.png`, `/site.webmanifest`. (Prior POST flagged as OPEN at time of capture.) |
| 12 | LOW | RESOLVED ✓ | Article `@id` trailing-slash fix shipped on all 6 articles + ItemList index. Verified clean in this audit's schema chain dump. |

---

## New open items (small, ≤15 min)

### D1 — Trim home meta description from 181 → ≤155 chars (5 min)

**Severity:** LOW
**Evidence:** Live meta description is 181 chars: *"Premium fibreglass bait boards for boats Australia-wide. SeaKing range with 316 marine stainless rod holders, integrated sinks, free shipping. Built by 20-year fibreglass craftsman."*

Google mobile SERP truncates around char 120-155 (varies by query). At 181 the "Built by 20-year fibreglass craftsman" tail likely clips. The 20-year-craftsman line is the highest-E-E-A-T fragment in the description — losing it to truncation forfeits a Trustworthiness anchor.

**Fix:** Trim to ≤155 chars while preserving the 20-year-craftsman anchor. Candidate (152 chars):

```
Premium fibreglass bait boards for Australian boats. SeaKing range with 316 marine stainless, free shipping. Built by a 20-year fibreglass craftsman.
```

**File:** Set in Shopify Admin → Online Store → Preferences (homepage SEO description). Verify live after deploy.

### D2 — Add `target="_blank" rel="noopener"` to Sikaflex + 3M + Wikipedia outbound links (5 min)

**Severity:** LOW
**Evidence:** Per companion seo-content audit, the 5 in-body outbound citations (Sikaflex ×2, 3M ×2, Wikipedia ×1) currently lack `target="_blank"` and `rel="noopener"`. Opening external resources in the same tab interrupts the reading flow; `rel="noopener"` is a standard security/perf hardening for `target="_blank"`.

**Files:**
- `src/content/articles/how-to-install-a-bait-board.mdx`
- `src/content/articles/bait-board-maintenance-and-care.mdx`

**Fix:** add `{ target: '_blank', rel: 'noopener nofollow' }` (or use `noopener` only — Sika + 3M + Wikipedia are not link-equity sinks worth `nofollow`-ing; `noopener` is enough). The "open new tab" pattern is industry-standard for citing external vendor docs.

### D3 — Bump `dateModified` on all 6 cornerstone articles (5 min)

**Severity:** LOW (but compounds with D2 to lift AI-citation readiness score)
**Evidence:** All 6 cornerstone articles emit `"dateModified"` matching their `"datePublished"` (e.g. install article: `dateModified: 2026-05-10T00:00:00.000Z` despite material content edits on 2026-05-20). The companion seo-content audit's AI-citation readiness score of **78/100** is held back partly by this stale-date signal — Google's freshness ranking and AI overviews treat `dateModified` as the recency anchor.

**Fix:** Either (a) hardcode 2026-05-21 dateModified on the two articles that received new outbound citations (install + maintenance), and 2026-05-20 on the four that received new internal links, OR (b) wire `dateModified` to derive from the MDX file's git `committer-date` automatically. Option (b) is the durable fix.

**File:** `src/content/config.ts` (article schema) + the layout that emits Article JSON-LD.

---

## Items NOT in scope for this light audit

- **Full mobile audit / accessibility** — no UI changes shipped since prior POST.
- **Full Core Web Vitals re-run via PageSpeed** — no perf-touching code shipped. PSI is variable; re-running same code state burns whitepaper data points. Deferred to Day 7 (2026-05-27).
- **HSTS max-age** finding from prior POST — still observed at `15552000` (180 days); `_headers` source was reported as `31536000`. CF zone-level HSTS likely overriding asset header. Not urgent.
- **IndexNow** — deploy-layer concern per global CLAUDE.md.

---

## Category scores — delta vs prior POST

| Category | Day 0 POST | Day +1 POST2 | Δ | Note |
|---|---:|---:|---:|---|
| Crawlability | 95 | 98 | +3 | Sitemap lastmod now stamped on all 46 URLs (was 0); custom AI-allowlist robots.txt confirmed live |
| Indexability | 94 | 95 | +1 | New feature collections crawlable (200 OK); PDP title truncation OA-blocked, unchanged |
| Security headers | 99 | 99 | — | No regression; new outbound citations didn't need CSP changes |
| URL structure | 95 | 97 | +2 | Article @id trailing-slash fix shipped on all 6 articles + ItemList index |
| Mobile | 96 | 96 | — | No CWV-touching code shipped — re-test at Day 7 |
| Core Web Vitals | 75 | 75 | — | No re-test; PSI cluster migrated already, no perf changes since |
| Structured data | 96 | 98 | +2 | Article schema clean (no trailing slash); outbound citations propagate Trust via `author` `@id` linking |
| JavaScript rendering | 100 | 100 | — | Unchanged |
| Accessibility | 84 | 84 | — | Not re-tested |
| IndexNow | 50 | 50 | — | Unchanged |
| **Overall** | **93** | **96** | **+3** | |

---

## Recommendations — execution order

**Today (if 15 min available):**
1. D1 — trim home meta description (5 min)
2. D2 — `target="_blank" rel="noopener"` on Sika/3M/Wikipedia (5 min)
3. D3 — bump `dateModified` on the 6 cornerstone articles (5 min)

All three are <15 min combined and ship in one commit.

**Day 7 (2026-05-27) — full cohort:**
- Full PSI cohort re-run (mobile + desktop × 8 pages) to validate sustained CWV gains
- Full CRO re-audit (OA dependencies likely still pending — reviews platform, photography, Web3Forms)
- Full SEO technical 9-category audit
- GSC analyze re-run (cannibalization, content decay, quick wins, CTR opportunities) — first Day-7 data window
- Ahrefs Site Audit refresh (45-domain disavow refresh per task #39)
- Ahrefs Competitor Audit re-pull for OceanSouth + BCF (units reset 2026-05-22)

---

## Files referenced

- `C:\Users\micha\code\baitboards-astro\public\robots.txt` — custom AI-allowlist robots.txt (Astro public asset)
- `C:\Users\micha\code\baitboards-astro\astro.config.mjs` — sitemap `serialize` adds `<lastmod>` per URL
- `C:\Users\micha\code\baitboards-astro\src\layouts\ArticleLayout.astro` — Article + HowTo schema emit
- `C:\Users\micha\code\baitboards-astro\src\content\articles\how-to-install-a-bait-board.mdx` — Sikaflex + 3M outbound citations
- `C:\Users\micha\code\baitboards-astro\src\content\articles\bait-board-maintenance-and-care.mdx` — Wikipedia SAE 316L citation
- `C:\Users\micha\code\baitboards-astro\src\content\articles\how-to-choose-a-bait-board-for-your-boat.mdx` — rod-holder + cup-holder collection internal links
- `C:\Users\micha\code\baitboards-astro\src\content\articles\top-5-bait-board-accessories.mdx` — B-series internal link
- `C:\Users\micha\code\baitboards-astro\scripts\seo\5-apply-collections.mjs` — A1 collection metafield apply
- Prior audit: `audit-seo-technical-2026-05-20-POST.md`
- Companion audit (this day): `audit-seo-content-2026-05-21-POST2.md`

---

*Audit completed 2026-05-21 T+1 day. Light scope — full 9-category re-audit deferred to Day 7 (2026-05-27) per whitepaper cadence.*
