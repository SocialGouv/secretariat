import debounceFn from "debounce-fn"
import { useEffect, useRef, useState } from "react"

import useSearch from "@/hooks/use-search"

const SearchField = () => {
  const { setQuery } = useSearch()
  const [value, setValue] = useState("")
  const debounced = useRef(debounceFn(setQuery, { wait: 500 }))

  useEffect(() => debounced.current(value), [value])

  return (
    <div className="search-field">
      <input
        type="search"
        name="search"
        value={value}
        placeholder="Rechercher"
        onChange={(e) => setValue(e.target.value)}
      />
      <button className="primary icon">
        <i className="ri-search-line"></i>
      </button>
    </div>
  )
}

export default SearchField
