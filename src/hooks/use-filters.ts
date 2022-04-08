import useSWR from "swr"

import SERVICES from "@/utils/SERVICES"
import usePaging from "@/hooks/use-paging"

interface Filters {
  alerts: boolean
  expiry: Date | null
  services: Record<string, boolean>
}

const useFilters = () => {
  const { setPage } = usePaging()

  const services = SERVICES.reduce(
    (accounts, account) => ((accounts[account] = true), accounts),
    {} as Record<string, boolean>
  )

  const fallbackData = { services, alerts: false, expiry: null } as Filters

  const { data: filters, mutate } = useSWR("filters", null, { fallbackData })

  const setFilters = (newFilters: Filters) => {
    setPage(1)
    mutate(newFilters)
  }

  return { filters, setFilters }
}

export default useFilters
