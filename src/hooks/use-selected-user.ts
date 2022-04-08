import useSWR from "swr"
// import { usePagedUsers } from "./use-paged-users"
// import useUsers from "./use-users"

const useSelectedUser = () => {
  // const users = useUsers()
  // const { pagedUsers } = usePagedUsers()

  // const key = {
  //   users,
  //   pagedUsers,
  // }

  const { data, mutate } = useSWR("selected-user", null)

  return { selectedUser: data as User, setSelectedUser: mutate }
}

export default useSelectedUser
