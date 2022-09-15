import * as docsearch from "@docsearch/react"
import "@docsearch/css"

const { DocSearch } =
  (docsearch as unknown as { default: typeof docsearch }).default || docsearch

interface SearchProps {
  lang?: string
}

const Search: React.FC<SearchProps> = ({ lang = "zh" }) => {
  return (
    <DocSearch
      appId="C3ROG2Z4EZ"
      indexName="duskmoon314"
      apiKey="6fd3ef15fabbd6e4589e820019157865"
      searchParameters={{ facetFilters: [`lang:${lang}`] }}
    />
  )
}

export default Search
