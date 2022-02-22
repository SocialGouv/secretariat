import { useMemo, useState } from "react"
import debounceFn from "debounce-fn"

import useSearch from "@/services/search"

const Search = () => {
  const { setQuery } = useSearch()
  const [value, setValue] = useState("")

  const updateSearch = useMemo(
    () => debounceFn(setQuery, { wait: 500 }),
    [setQuery]
  )

  return (
    <div className="search">
      <input
        type="text"
        name="search"
        value={value}
        placeholder="recherche par nom ou par email"
        onChange={(e) => {
          setValue(e.target.value)
          updateSearch(e.target.value)
        }}
      />
    </div>
  )
}

export const StickySearch = () => (
  <div className="sticky top-0 pt-10 z-10 bg-white">
    <Search />
  </div>
)

export default Search
