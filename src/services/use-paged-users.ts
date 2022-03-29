import useSWR from "swr"

import usePaging from "./use-paging"
import useFilteredUsers from "./use-filtered-users"

export const usePagedUsers = () => {
  const { page, pageSize } = usePaging()
  const { users, query, filters } = useFilteredUsers()

  const key = { users, filters, query, page }

  const getData = () => users?.slice(0, (page || 1) * pageSize)

  const { data, mutate } = useSWR(users ? key : null, getData, {
    fallbackData: getData(),
  })

  return { pagedUsers: data, setPagedUsers: mutate }
}
