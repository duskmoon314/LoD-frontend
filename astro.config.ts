import { defineConfig } from "astro/config"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import astroI18next from "astro-i18next"
import svelte from "@astrojs/svelte"
import react from "@astrojs/react"

// https://astro.build/config
export default defineConfig({
  site: "https://duskmoon314.com/",
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "zh",
        locales: {
          zh: "zh",
          en: "en",
        },
      },
    }),
    tailwind(),
    astroI18next(),
    svelte(),
    react(),
  ],
  vite: {
    ssr: {
      external: ["svgo"],
    },
  },
  markdown: {
    remarkPlugins: ["remark-gfm", "remark-smartypants", "remark-math"],
    rehypePlugins: [
      "rehype-mathjax",
      "rehype-slug",
      [
        "rehype-autolink-headings",
        {
          behavior: "prepand",
        },
      ],
      "rehype-toc",
    ],
  },
})
