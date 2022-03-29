import useSWR from "swr"

const usePaging = () => {
  const pageSize = 20
  const { data, mutate } = useSWR("paging", null, { fallbackData: 1 })

  return { page: data, setPage: mutate, pageSize }
}

export default usePaging
