// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import rehypeImgAttrs from "./src/plugins/rehype-img-attrs.mjs";

const siteUrl = "https://www.baitboardsdirect.com";

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
        return true;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
