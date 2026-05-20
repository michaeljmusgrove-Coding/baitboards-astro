// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import rehypeImgAttrs from "./src/plugins/rehype-img-attrs.mjs";

const siteUrl = "https://baitboardsdirect.com";

export default defineConfig({
  output: "static",
  site: siteUrl,
  trailingSlash: "never",
  build: {
    format: "file",
    inlineStylesheets: "always",
  },
  markdown: {
    rehypePlugins: [rehypeImgAttrs],
  },
  integrations: [
    svelte(),
    sitemap({
      filter: (page) => {
        if (page.includes("/thank-you")) return false;
        if (page.includes("/404")) return false;
        return true;
      },
      // Stamp every entry with the build timestamp so Google sees a fresh
      // lastmod each deploy. Cheap signal; reset on every successful build.
      // (Per-page mtime would be more accurate but Astro's sitemap integration
      // doesn't expose source-file paths in the serialize callback.)
      serialize(item) {
        item.lastmod = new Date().toISOString();
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
