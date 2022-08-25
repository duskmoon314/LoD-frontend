import { defineConfig } from "astro/config"
import image from "@astrojs/image"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import astroI18next from "astro-i18next"

// https://astro.build/config
export default defineConfig({
  site: "https://duskmoon314.com",
  // @ts-ignore
  experimental: {
    integrations: true,
  },
  integrations: [
    mdx(),
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
    image(),
    astroI18next(),
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
