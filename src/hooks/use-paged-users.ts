import useSWR from "swr"

import usePaging from "@/hooks/use-paging"
import useFilteredUsers from "@/hooks/use-filtered-users"

export const usePagedUsers = () => {
  const { page, pageSize } = usePaging()
  const { users, query, filters } = useFilteredUsers()

  const key = { users, filters, query, page }

  const getData = () => {
    console.log("---> GET PAGED DATA")
    return users?.slice(0, (page || 1) * pageSize)
  }

  const { data, mutate } = useSWR(users ? key : null, getData, {
    fallbackData: getData(),
  })

  // const { data, mutate } = useSWR(users ? key : null, getData)

  return { pagedUsers: data, setPagedUsers: mutate }
}
