import debounceFn from "debounce-fn"
import { useMemo, useState } from "react"

import SERVICES from "@/utils/SERVICES"
import useSearch from "@/services/search"
import ServiceLogo from "@/components/common/service-logo"
import { useFilteredUsers } from "@/services/users"
import useFilters from "@/services/filters"

const Count = () => {
  const { users: filteredUsers } = useFilteredUsers()
  return (
    <div className="counts">
      <div>
        <strong>{filteredUsers?.length}</strong> comptes utilisateurs
      </div>
    </div>
  )
}

const Filters = () => {
  const { filters: services, setFilters: setServices } = useFilters()

  return (
    <div className="filters">
      <div className="services">
        {Object.keys(services || []).map((service, i) => (
          <div
            key={i}
            className={`service ${
              services && services[service] ? "" : " opacity-25"
            }`}
            onClick={() =>
              setServices({
                ...services,
                [service]: !(services && services[service]),
              })
            }
          >
            <ServiceLogo service={service as ServiceName} size="sm" />
          </div>
        ))}
      </div>
      <Count />
    </div>
  )
}

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

const Search = () => (
  <div className="search">
    <SearchField />
    <Filters />
  </div>
)

export default Search
