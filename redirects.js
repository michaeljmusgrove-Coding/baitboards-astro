/**
 * Programmatic redirect map.
 * Entries: { from: '/legacy-path', to: '/new-path', status: 301 }
 * Populated post-launch when legacy Shopify URL mapping is complete.
 */
const redirects = [];

export function matchRedirect(pathname) {
  return redirects.find((r) => r.from === pathname) ?? null;
}
