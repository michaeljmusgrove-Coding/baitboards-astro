/**
 * Programmatic redirect map — populated from content audit (6 May 2026).
 * Entries: { from: '/legacy-path', to: '/new-path', status: 301 }
 *
 * Products (/products/*) and collections (/collections/*) keep identical URLs
 * in the new build — zero redirects needed for those.
 *
 * Only Shopify /pages/* routes need redirects since we drop the /pages/ prefix.
 */
const redirects = [
  { from: '/pages/about-us',            to: '/about',          status: 301 },
  { from: '/pages/contact',             to: '/contact',        status: 301 },
  { from: '/pages/faqs',                to: '/faqs',           status: 301 },
  { from: '/pages/privacy-policy',      to: '/privacy-policy', status: 301 },
  { from: '/pages/return-refund-policy', to: '/returns',       status: 301 },
  { from: '/pages/shipping-policy',     to: '/shipping',       status: 301 },
  { from: '/pages/terms-of-service',    to: '/terms',          status: 301 },
];

export function matchRedirect(pathname) {
  return redirects.find((r) => r.from === pathname) ?? null;
}
