import useSWR from "swr"

const useSearch = () => {
  const { data, mutate } = useSWR("search", null, { fallbackData: "" })

  const setSearch = (search: string): void => {
    mutate(search)
  }

  return { query: data, mutate: setSearch }
}

export default useSearch
