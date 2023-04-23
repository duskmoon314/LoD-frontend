import type { AstroI18nextConfig } from "astro-i18next/index"

export default <AstroI18nextConfig>{
  defaultLocale: "zh",
  locales: ["zh", "en"],
  namespaces: ["site", "home"]
}
