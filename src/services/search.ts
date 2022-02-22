import useSWR from "swr"

const useSearch = () => {
  const { data, mutate } = useSWR("search", null, { fallbackData: "" })
  return { query: data, setQuery: mutate }
}

export default useSearch
