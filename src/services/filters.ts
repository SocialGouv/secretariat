import useSWR, { mutate } from "swr"
import SERVICES from "@/utils/SERVICES"
import { usePaging } from "./users"

const useFilters = () => {
  const { setPage } = usePaging()

  const { data: filters, mutate } = useSWR("filters", null, {
    fallbackData: SERVICES.reduce(
      (services, service) => ((services[service] = true), services),
      {} as Record<string, boolean>
    ),
  })

  const setFilters = (filters: Record<string, boolean>) => {
    setPage(1)
    mutate(filters)
  }

  return { filters, setFilters }
}

export default useFilters
