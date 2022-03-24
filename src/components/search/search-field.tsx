import debounceFn from "debounce-fn"
import { useMemo, useState } from "react"

import useSearch from "@/services/search"

const SearchField = () => {
  const { setQuery } = useSearch()
  const [value, setValue] = useState("")

  const updateSearch = useMemo(
    () => debounceFn(setQuery, { wait: 500 }),
    [setQuery]
  )

  return (
    <div className="search-field">
      <input
        type="search"
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

export default SearchField
