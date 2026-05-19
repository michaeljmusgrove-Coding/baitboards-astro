// Cloudflare Worker entry point.
// Handles redirects programmatically (per redirects.js), then falls through to static-asset serving.
// Strips trailing slashes — Astro build.format: 'file' outputs foo.html, not foo/index.html.

import { matchRedirect } from './redirects.js';

export default {
  /**
   * @param {Request} request
   * @param {{ ASSETS: Fetcher }} env
   */
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 1. Check programmatic redirect map
    const redirect = matchRedirect(pathname);
    if (redirect) {
      const target = new URL(redirect.to, url.origin);
      target.search = url.search;
      return new Response(null, {
        status: redirect.status,
        headers: { Location: target.toString() },
      });
    }

    // 2. Strip trailing slash — redirect /foo/ → /foo (except root)
    if (pathname !== '/' && pathname.endsWith('/') && !pathname.startsWith('/_astro/')) {
      const target = new URL(pathname.slice(0, -1), url.origin);
      target.search = url.search;
      return new Response(null, {
        status: 301,
        headers: { Location: target.toString() },
      });
    }

    // 3. Fall through to static asset binding.
    // Workers Static Assets applies dist/_headers AFTER this Worker and uses
    // those headers as the final response headers on 200s — Worker-set headers
    // are silently dropped on known-asset matches. Staging's X-Robots-Tag is
    // therefore injected into dist/_headers at build time by
    // scripts/postbuild-csp.mjs when DEPLOY_ENV=staging, not here.
    return env.ASSETS.fetch(request);
  },
};
