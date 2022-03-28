import debounceFn from "debounce-fn"
import { useEffect, useRef, useState } from "react"

import useSearch from "@/services/search"

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
        placeholder="chercher un compte utilisateur..."
        onChange={(e) => {
          setValue(e.target.value)
        }}
      />
    </div>
  )
}

export default SearchField
