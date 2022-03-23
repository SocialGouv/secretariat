import useSWR, { mutate } from "swr"
import SERVICES from "@/utils/SERVICES"
import { usePaging } from "./users"

interface Filters {
  alerts: boolean
  services: Record<string, boolean>
  dates: { arrival?: Date; departure?: Date }
}

const useFilters = () => {
  const { setPage } = usePaging()

  const services = SERVICES.reduce(
    (services, service) => ((services[service] = true), services),
    {} as Record<string, boolean>
  )

  const { data: filters, mutate } = useSWR("filters", null, {
    fallbackData: {
      services,
      dates: {},
      alerts: false,
    },
  })

  const setFilters = (filters: Filters) => {
    setPage(1)
    mutate(filters)
  }

  return { filters, setFilters }
}

export default useFilters
