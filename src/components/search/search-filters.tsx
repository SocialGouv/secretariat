import useFilters from "@/services/filters"
import SearchCount from "@/components/search/search-count"
import ServiceLogo from "@/components/common/service-logo"

const SearchFilters = () => {
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
      <SearchCount />
    </div>
  )
}

export default SearchFilters
