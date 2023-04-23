/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      minHeight: {
        "half-screen": "50vh",
      },
      typography: {
        DEFAULT: {
          css: {
            // set style of inline math formula
            'span[class~="math-inline"]': {
              'mjx-container[jax="SVG"]': {
                svg: {
                  display: "inline",
                },
              },
            },
            "img,svg": {
              margin: "auto",
              maxWidth: "100%",
            },
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:first-of-type::after": { content: "none" },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],

  daisyui: {
    themes: ["winter", "night"],
  },
}
