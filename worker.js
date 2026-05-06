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

    // 3. Fall through to static asset binding
    const response = await env.ASSETS.fetch(request);

    // Workers ignores _headers files — inject noindex for workers.dev staging
    // so Google doesn't index the preview environment against production canonicals.
    if (url.hostname.endsWith('.workers.dev')) {
      const headers = new Headers(response.headers);
      headers.set('X-Robots-Tag', 'noindex, nofollow');
      return new Response(response.body, { status: response.status, headers });
    }

    return response;
  },
};
