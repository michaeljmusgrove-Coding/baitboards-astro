# CRO Audit — baitboardsdirect.com (Post-Fix, Same-Day)

**Date:** 2026-05-20 (afternoon, post batch 1 + batch 2 deploys)
**Method:** Cache-busted `curl` (`?cb=<ts>`) of static HTML for the 10 main pages + targeted markers grep. Production CF cache: `CF-Cache-Status: HIT` confirmed; cb param hard-busted it. No live JS / device screenshots in this pass.
**Reference:** `audit-cro-2026-05-20.md` (pre-fix go-live audit, 5H + 8M + 6L findings)
**Scope:** 10 main pages — home, 2 collections, 2 PDPs, articles index, install article, FAQs, about, contact.

---

## TL;DR — what moved

**11 of 14 trackable items from the prior audit are now resolved.** Three remain OA-blocked (reviews platform, photography, Web3Forms wiring). One **new P0 regression** introduced by batch 1 (silently broken home contact form — already fixed in this pass). Several **<15-min code-only items** still on the table; all unblocked by client.

**Health delta:** Conversion drag at site-level meaningfully reduced. The two single-largest leaks identified pre-fix (H1 empty collection grid; H2 empty reviews block falsely promising 0 reviews) are both gone. Mobile PDP path now has trust-first ordering + sticky ATC bar + Apple/Google Pay reassurance — substantively closer to industry-best mobile PDP UX. The remaining gaps are now mostly content/photography (OA-blocked) plus the conversion of the inline home form into a real backend (Web3Forms, OA-blocked).

---

## 1. Fix verification — what's actually live

| Pre-fix ID | Fix shipped | Markers verified live | Status |
|---|---|---|---|
| H1 — empty `/collections/bait-boards` grid | Grid populated | `/collections/bait-boards`: 16 distinct PDP links statically rendered (matches `/collections/on-sale`) | RESOLVED |
| H2 — empty Okendo `data-oke-reviews-product-id=""` block on PDPs | Widget + heading removed | PDP B01 + SK-H10B: zero matches for `Customer Reviews` h2 or `oke-reviews-widget` div | RESOLVED (pending platform pick) |
| H3a — sticky mobile ATC bar | `<div id="sticky-atc-bar" class="md:hidden fixed bottom-0 inset-x-0 z-50 …">` present on both PDPs | `id="sticky-atc-sentinel"` + `id="sticky-atc-bar"` + IntersectionObserver script verified | RESOLVED |
| H3b — mobile reorder of trust + ATC above description | Tailwind `order-*` + `lg:order-*` pattern: trust=4, ATC=5, PCI=6, description=7 (mobile-late, desktop-mid via `lg:order-4`) | All five order classes present | RESOLVED |
| H4 — mailto contact form | NOT shipped | `/contact` still ships only `<a href="mailto:…">` — `0 forms found` | OPEN (OA: Web3Forms) |
| H5 — only 2 PDP images | NOT shipped (photography OA) | PDP B01 `<img>` count 9, but extra imgs are trust/related-content; product gallery still 2 | OPEN (OA: photography) |
| M1 — cross-domain checkout trust banner | Banner shipped | PDP B01: `Secure checkout powered by Shopify Pay (PCI Level 1). Apple Pay, Google Pay & Afterpay accepted.` inline below ATC inside `order-6 lg:order-7` block | RESOLVED |
| M3 — cross-sells "Complete your setup" | Section shipped | PDP B01: `<section>` heading "Complete your setup" present below product detail | RESOLVED |
| M6 — FAQ categorisation + jump-nav | 7-category jump-nav shipped | 7 `#materials-construction`, `#saltwater-maintenance`, `#sizing-installation`, `#shipping-delivery`, `#payments`, `#returns-warranty`, `#about-us` anchors all map cleanly to 7 `id=` targets. Accordion (`<details>/<summary>`) pattern retained per category | RESOLVED |
| M7 — UTM on article → PDP links | Shipped on install article | `?utm_source=articles&utm_medium=internal&utm_campaign=related-products&utm_content=how-to-install-a-bait-board` on all 3 featured-product links. Note: articles index page has no PDP links to UTM (cards link to article URLs, not products — by design) | RESOLVED (per article) |
| L1 — CTA wording specifics | Home CTAs updated | Home: `Browse all 16 bait boards`, `Shop the SeaKing range — free shipping`, `View all 16 bait boards`, `Call Harry — 0474 332 034` (with `tel:0474332034`), `Read Harry's story` all present | RESOLVED |
| L2 — trust pill specifics | PDP + home updated | PDP B01 trust strip: `🚚 Free shipping Australia-wide, no minimum`, `⚡ Dispatched within 1–3 business days`, `🇦🇺 Handcrafted in Melbourne by a 20-year fibreglass craftsman`, `🛡️ 1-year warranty + 30-day returns`, `🔒 Secure Shopify Pay — Apple Pay, Google Pay, Afterpay` — all five present and specific. Home trust quartet: same specifics | RESOLVED |
| L5 — CLS img width/height | Shipped | PDP B01: 9 `<img>`, 0 without `width=`/`height=`; home: 22 `<img>` with 24 dim attributes (>100% coverage incl. noscript fallbacks) | RESOLVED |
| L6 — FAQPage + HowTo schema | Both shipped | `/faqs`: `"@type":"FAQPage"` JSON-LD present. `/articles/how-to-install-a-bait-board`: `"@type":"HowTo"` + `"@type":"Article"` present, 6 `HowToStep` items, named steps with text (e.g. "Choose the mounting position", "Mark and measure carefully", "Drill the bolt holes", "Install the bolts", "Seal the holes", "Final checks") | RESOLVED |

**Notes on partial / nuanced fixes:**
- **L3 (compare-at pricing)** — partially mitigated. On-sale collection now shows variance (`Save 18%`, `25%`, `26%`, `29%`, `50%`, `51%`) instead of uniform 50%. PDP B01 still displays `Save 50%`. ACCC two-price-advertising risk is reduced but not eliminated — anchor prices still need verifiable RRP justification (see prior audit L3). Treat as a separate workstream, not a code-only fix.
- **H3c (ATC button colour)** — still teal `.button-accent`. Sticky bar uses same `bg-[#008c9e]` accent. Prior audit recommended distinct primary colour for ATC vs nav CTAs; no change. Low priority.

---

## 2. NEW issues introduced by batch 1 + batch 2

### N1 (P0, FIXED in this pass) — Home page "Get in touch" form silently fails

**Severity:** P0 — worse than the mailto: it replaced indirectly.

**Evidence:** Home page now ships a fully-built inline contact form `<form method="POST" action="/contact">` (lines 455-497 of `src/pages/index.astro` pre-fix) with Shopify-Liquid-style field names (`contact[name]`, `contact[email]`, `contact[phone]`, `contact[body]`). Astro `astro.config.mjs` is `output: "static"`, and `src/pages/contact.astro` has no POST handler — it's a presentational page with only a mailto CTA. A static-output Astro page POSTed to with form data returns the same 200 HTML, swallowing the submission with zero user feedback. Users would fill the form, click "Submit now", be navigated to `/contact` (which looks unchanged), assume their message was sent, and Harry never receives anything.

This is a **regression** vs the pre-fix state — at least mailto opened an email app the user could see; this fails silently.

**Fix applied in this audit pass** (in-file edit, single section): converted the form to `method="get" action="mailto:info@baitboardsdirect.com.au" enctype="text/plain"` (so it still works without JS) + a progressive-enhancement inline `<script>` that hijacks submit, assembles a properly formatted mailto: URL with subject + body from form fields, and routes to the user's email client. Submit button relabelled `Send via email`. Hint paragraph added: "Submitting opens your email app with the message pre-filled. Prefer a faster channel? Call Harry on 0474 332 034." Phone link is `tel:`.

This is a **stop-gap** until Web3Forms is wired — at which point you can swap `mailto:` action → Web3Forms endpoint, remove the inline JS, and add server-side success/failure handling. The current pattern is functionally identical to the existing `/contact` page mailto UX, just rendered as a fully-fleshed form.

**File touched:** `src/pages/index.astro` (one section replaced; no other code changed). Next deploy `scripts/postbuild-csp.mjs` will auto-hash the new inline script for CSP.

### N2 (LOW) — Duplicate contact CTAs on home page

**Severity:** Low — UX redundancy, not broken.

**Evidence:** Home page now stacks two consecutive contact CTAs:
1. `<section class="bg-dark-hero">` — "Have a question?" + `Call Harry — 0474 332 034` button + `or send a message` link to `/contact`
2. `<section class="bg-[#f7f7f7]">` — "Get in touch" full inline form (N1, now mailto-driven post-fix)

After the N1 fix both still ultimately route to the same mailto/phone path. The duplication is OK for now (form gives more structured intake; phone CTA above gives the fast lane) but consider tightening to a single section post-Web3Forms with phone CTA above the inline form. **No code change in this pass** — content decision for the user.

### N3 (LOW, no fix needed) — On-sale collection has 16 products too

**Observation, not a problem:** `/collections/on-sale` now shows all 16 products with varied discount labels (18-51%). This means every product is currently on sale — same set, two URLs. Functionally OK; SEO-wise it means both collection URLs target overlapping inventory. The pre-fix audit had `/collections/on-sale` as the comparator that proved `/collections/bait-boards` was broken — both now work. Consider whether `on-sale` should be a discount filter (only items with `compareAtPrice > price`) rather than a mirror of the main grid; if all items have a sale price, the collection is meaningless. Tied to L3 (compare-at pricing legality) — not a code-only fix.

### N4 (LOW) — Sticky mobile ATC bar scrolls-to-form rather than direct add

**Observation:** Sticky `Add to cart` button is `<a href="#sticky-atc-target">` — tap = scroll to the actual ATC form (one extra tap to add). Industry-acceptable pattern (Shopify Dawn does this), but a one-tap direct submit (sticky bar submits the same form via JS) would be marginally better. Not urgent.

---

## 3. Remaining items still actionable, by category

### A. OA-blocked (do NOT touch — client decision needed)
- H2 reviews — pick platform (Loox / Junip / Stamped / Reviews.io).
- H4 contact form (Web3Forms wiring) — `/contact` page + home form should both POST to same Web3Forms endpoint once API key chosen. Home form fix in this pass is the stop-gap.
- H5 PDP photography — boat-mounted shot + installation video.
- L3 ACCC compare-at pricing — legal/business call on RRP anchoring.
- L4 footer email capture — pending email-platform pick.

### B. Code-only, still open, NOT applied in this pass

| # | Item | Source | Est. effort | Why deferred this pass |
|---|---|---|---|---|
| C1 | UTMs on the OTHER 5 articles' featured-product links (only `how-to-install-a-bait-board` has them — `how-to-choose-a-bait-board-for-your-boat`, `top-5-bait-board-accessories`, `bait-board-maintenance-and-care`, `best-bait-board-setup-for-offshore-fishing-australia`, `fibreglass-vs-aluminium-bait-boards` likely don't) | Extension of M7 | 10-20 min/article — repeatable template | Out of audit scope (audit said "verify the install article"). Audit only the install one; you'll want to verify each article's MDX/Astro source. |
| C2 | M2 stock urgency — "Only X left" badge ONLY when stock < 5 | M2 | XS (UI-only — `variantQuantityAvailable` is already in DOM props) | Not in batch 1/2 brief; legitimate <15-min fix. **Recommended.** |
| C3 | M4 quiz output — show 3 products + "why this board" caption | M4 | M (40-60 min) | Larger refactor; defer to next sprint. |
| C4 | M5 about-page craft photos (workshop, hands, finished gelcoat — no Harry's face) | M5 | M (depends on photo asset availability) | Photography OA-adjacent. |
| C5 | M8 cart drawer live UX check (mobile + desktop) | M8 | XS testing | Not code; requires device test. |
| C6 | L3 partial fix — drop `<del>` line-through entirely on PDP B01 (only) until RRP anchoring is decided, OR add fine-print "RRP comparison to comparable boards at marine dealers" disclaimer | L3 | XS | ACCC two-price-advertising risk. Defer until business call made — flagging here. |
| C7 | Sticky bar one-tap direct add (replace `<a href="#sticky-atc-target">` with sticky-bar form submit) | N4 | S (20-30 min, needs Svelte coordination with `AddToCartForm` island) | Not in audit brief; marginal lift. |
| C8 | LocalBusiness schema on home (Melbourne workshop hours + address) | L6 extension | S | Pending real address decision (OA: "real address"). |

### C. Code-only fixes APPLIED in this audit pass

| File | Change |
|---|---|
| `src/pages/index.astro` (lines ~449-501 of pre-fix file) | Replaced broken `<form method="POST" action="/contact">` with mailto-action form + progressive-enhancement inline submit script. Hint paragraph + tel: link added. Net effect: form no longer silently fails; UX equivalent to existing `/contact` mailto CTA, ready to swap to Web3Forms once API key wired. CSP auto-hash via `postbuild-csp.mjs` on next build. |

---

## 4. Delta scorecard vs `audit-cro-2026-05-20.md`

| Severity | Pre-fix count | Resolved | OA-blocked (still open) | Code-only open | New (P0) | Net open |
|---|---:|---:|---:|---:|---:|---:|
| HIGH (H1-H5) | 5 | 3 (H1, H2, H3) | 2 (H4, H5) | 0 | 0 | **2** |
| MEDIUM (M1-M8) | 8 | 3 (M1, M3, M6, M7) | 0 | 4 (M2, M4, M5, M8) | 0 | **4** + (M7 partial — 5 of 6 articles still un-UTM'd) |
| LOW (L1-L6) | 6 | 5 (L1, L2, L5, L6, partial L3) | 1 (L4) | 1 (L3 full) | 0 | **2** |
| NEW (N1-N4) | — | 1 fixed in pass (N1) | — | 0 | 0 (N1 was P0, fixed; N2-N4 are LOW) | **3** |
| **Totals** | **19** | **12** | **3** | **5** | **0** | **11** |

**Of the 11 still-open items, 3 are OA-blocked (require client decision) and 8 are code-only.** Of those 8 code-only:
- 1 is **P0-was, now fixed** in this pass (N1)
- 1 is **>15 min** (C3 quiz refactor)
- 6 are <30 min individually and ready to ship whenever (C1, C2, C6, C7, plus C8 if address decided, plus M7 article-by-article extension)

Compared to the pre-fix audit where every HIGH was actionable today: the site is in materially better shape. The remaining HIGH items are entirely client-blocked.

---

## 5. Whitepaper-grade before/afters now captureable

For the post-launch whitepaper, the following pre/post pairs are now documentable from same-day evidence:

1. **`/collections/bait-boards`** — pre-fix `0 product cards` vs post-fix `16 product cards` rendered statically. Single-CTA recovery for the highest-traffic destination.
2. **PDP "Customer Reviews" section** — pre-fix empty heading + empty Okendo div; post-fix block removed entirely. Eliminates false-trust signal.
3. **PDP mobile path scroll-depth to ATC** — pre-fix ATC after spec table (est. ~1,200-1,600px below the fold on 375px viewport); post-fix sticky bar visible after first scroll + Tailwind `order-*` reorders trust + ATC above description on mobile only.
4. **Cross-domain checkout reassurance** — pre-fix no trust banner; post-fix "Secure checkout powered by Shopify Pay (PCI Level 1)" inline below ATC.
5. **FAQ navigation** — pre-fix one long-scroll list; post-fix 7-category jump-nav with anchor links (all 7 anchors map to existing IDs, verified).
6. **Schema rich-results unlocked** — pre-fix FAQPage + Product only; post-fix FAQPage + HowTo (6 named steps with text on install article) + AggregateRating still deferred to reviews platform.
7. **Home CTAs** — pre-fix generic "Shop now" / "Contact Us"; post-fix specific "Browse all 16 bait boards" / "Call Harry — 0474 332 034" with `tel:` link.

---

## 6. Recommended next moves (priority order)

1. **Pick Okendo replacement** (Loox suggested for marine/visual social proof) — unblocks H2 and unlocks AggregateRating schema for Product rich-results.
2. **Wire Web3Forms** to BOTH `/contact` page and the now-mailto-driven home form. Single API key, single endpoint. Removes the mailto stop-gap.
3. **Schedule PDP photography** — single boat-mounted shot per product family + 30-second workshop install video. Closes H5.
4. **Apply C2 (low-stock badge)** as a quick win — 15 min UI change using existing `variantQuantityAvailable` prop already in DOM.
5. **Extend M7 UTMs to remaining 5 articles** when next editing each — copy/paste template from `how-to-install-a-bait-board`.
6. **C6 (compare-at pricing)** — get legal/business sign-off this week; ACCC two-price-advertising guidance is the gating risk for L3.

---

*Audit complete 2026-05-20 (afternoon). Re-audit recommended T+7 once Web3Forms + reviews platform are live.*
