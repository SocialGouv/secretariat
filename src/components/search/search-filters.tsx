import useFilters from "@/hooks/use-filters"
import Badge from "@/components/common/badge"
import SearchCount from "@/components/search/search-count"
import ServiceLogo from "@/components/common/service-logo"

const SearchFilters = () => {
  const { filters, setFilters } = useFilters()

  const handleServiceClick = (service: string) => {
    if (filters) {
      const activeServices = Object.values(filters.services || {}).filter(
        (s) => s === true
      )
      if (activeServices.length > 1 || !filters.services[service]) {
        setFilters({
          ...filters,
          services: {
            ...filters.services,
            [service]: !(filters.services && filters.services[service]),
          },
        })
      }
    }
  }

  const handleAlertsClick = () => {
    if (filters) {
      setFilters({ ...filters, alerts: !filters.alerts })
    }
  }

  const handleExpiryClick = () => {
    if (filters) {
      setFilters({
        ...filters,
        expiry: filters.expiry ? null : new Date(),
      })
    }
  }

  return (
    <div className="filters">
      <div className="actions">
        <div className="services">
          {Object.keys(filters?.services || []).map((service, i) => (
            <div
              key={i}
              className="service"
              onClick={() => handleServiceClick(service)}
            >
              <ServiceLogo
                size="sm"
                name={service as ServiceName}
                disabled={!filters?.services || !filters.services[service]}
              />
            </div>
          ))}
        </div>
        <div className="alert-filter" onClick={() => handleAlertsClick()}>
          <Badge
            label="Alerte"
            type={`warning${filters?.alerts ? "" : " disabled"}`}
          />
        </div>
        <div className="expiry-filter" onClick={() => handleExpiryClick()}>
          <Badge
            label="Expiration"
            type={`expiry${filters?.expiry ? "" : " disabled"}`}
          />
        </div>
      </div>
      <SearchCount />
    </div>
  )
}

export default SearchFilters
