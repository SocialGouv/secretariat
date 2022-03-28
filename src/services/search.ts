import useSWR from "swr"
import { usePaging } from "./users"

const useSearch = () => {
  const { setPage } = usePaging()
  const { data, mutate } = useSWR("search", null, { fallbackData: "" })

  const setQuery = (filters: string) => {
    console.log("setQuery", filters)

    setPage(1)
    mutate(filters)
  }

  return { query: data, setQuery }
}

export default useSearch
