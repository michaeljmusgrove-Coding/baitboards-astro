# Outbound + internal link health audit — baitboardsdirect.com

**Run date:** 2026-05-20
**Origin:** https://baitboardsdirect.com
**Sitemap:** https://baitboardsdirect.com/sitemap-index.xml
**Tool:** `scripts/seo/link-check.mjs` — built in-house per user policy 2026-05-20 (no Ahrefs UI Site Audit project; centralise SEO tooling in this repo).

---

## TL;DR

- **Pages crawled:** 44 (from sitemap)
- **Unique links checked:** 53
- **Healthy (2xx):** 51
- **Redirect chains (>1 hop):** 2
- **4xx (broken / forbidden):** 0
- **5xx (server error):** 0
- **Network errors / timeouts:** 0
- **Page-fetch failures:** 0

---

## 🔴 4xx — broken links

Links from one of our pages that return a 4xx status. Top action item — fix or remove.

_None found._

## 🔴 5xx — server errors

Target servers errored. Often transient but worth a recheck.

_None found._

## 🟡 Network errors / timeouts

Target host unreachable, DNS fail, or >15s timeout. Often the host is alive but slow — worth manual confirmation.

_None found._

## 🟡 Redirect chains (>1 hop)

Costs crawl budget. Ideal: link directly to final destination. We control all internal redirects via `worker.js` + `redirects.js`; external chains we can only re-anchor at the link source.

| URL | int/ext | Final | Chain | Reason | Source pages |
|---|---|---|---|---|---|
| https://baitboardsdirect.com/articles/fibreglass-vs-aluminium-bait-boards/ | int | 200 | 301 → 200 |  | /articles/bait-board-maintenance-and-care |
| https://baitboardsdirect.com/articles/how-to-install-a-bait-board/ | int | 200 | 301 → 200 |  | /articles/bait-board-maintenance-and-care |

---

## Method notes

- Sitemap-index fetch → expand nested sitemaps → dedupe URLs.
- HTML extracted via regex on `<a href=...>` — sufficient for static Astro output. No JS evaluation (matches Googlebot static-fetch pass).
- Each unique linked URL HEAD-checked first; if HEAD returns 405/403/501, retried as GET.
- Redirects followed manually (max 6 hops) so chain length + each hop status is recorded.
- Concurrency capped at 8. Timeout 15000ms per fetch.
- This audit substitutes for the Ahrefs UI Site Audit outgoing-broken-link signal. Per CLAUDE.md §5: all SEO tooling stays in this repo + gsc-monitor.
