import useSWR from "swr"

import usePaging from "@/hooks/use-paging"

const useSearch = () => {
  const { setPage } = usePaging()
  const { data, mutate } = useSWR("search", null, { fallbackData: "" })

  const setQuery = (filters: string) => {
    document.getElementsByClassName("page")[0].scrollTo(0, 0)
    setPage(1)
    mutate(filters)
  }

  return { query: data, setQuery }
}

export default useSearch
