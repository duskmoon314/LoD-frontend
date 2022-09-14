import * as docsearch from "@docsearch/react"
import "@docsearch/css"

const { DocSearch } =
  (docsearch as unknown as { default: typeof docsearch }).default || docsearch

const Search: React.FC = () => {
  return (
    <DocSearch
      appId="C3ROG2Z4EZ"
      indexName="duskmoon314"
      apiKey="6fd3ef15fabbd6e4589e820019157865"
    />
  )
}

export default Search
