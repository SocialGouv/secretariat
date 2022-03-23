import debounceFn from "debounce-fn"
import { useMemo, useState } from "react"

import useSearch from "@/services/search"
import useFilters from "@/services/filters"
import { useFilteredUsers } from "@/services/users"
import ServiceLogo from "@/components/common/service-logo"

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
  const { filters, setFilters } = useFilters()

  return (
    <div className="filters">
      <div className="services">
        {Object.keys(filters?.services || []).map((service, i) => (
          <div
            key={i}
            className={`service ${
              filters?.services && filters.services[service]
                ? ""
                : " opacity-25"
            }`}
            onClick={() =>
              filters?.services &&
              (Object.values(filters.services || {}).filter(
                (service) => service === true
              ).length > 1 ||
                !filters.services[service]) &&
              setFilters({
                dates: filters.dates,
                alerts: filters.alerts,
                services: {
                  ...filters.services,
                  [service]: !(filters.services && filters.services[service]),
                },
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
