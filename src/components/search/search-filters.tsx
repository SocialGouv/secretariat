import useFilters from "@/services/filters"
import Badge from "@/components/common/badge"
import SearchCount from "@/components/search/search-count"
import ServiceLogo from "@/components/common/service-logo"
import { useState } from "react"

const SearchFilters = () => {
  const { filters, setFilters } = useFilters()

  const handleServiceClick = (service: string) => {
    if (filters) {
      const activeServices = Object.values(filters.services || {}).filter(
        (service) => service === true
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

  return (
    <div className="filters">
      <div className="actions">
        <div className="services">
          {Object.keys(filters?.services || []).map((service, i) => (
            <div
              key={i}
              onClick={() => handleServiceClick(service)}
              className={`service ${
                filters?.services && filters.services[service]
                  ? ""
                  : " opacity-25"
              }`}
            >
              <ServiceLogo service={service as ServiceName} size="sm" />
            </div>
          ))}
        </div>
        <div className="alerts" onClick={() => handleAlertsClick()}>
          <Badge
            type={`warning${filters?.alerts ? "" : " disabled"}`}
            label="Alerte"
          />
        </div>
      </div>
      <SearchCount />
    </div>
  )
}

export default SearchFilters
