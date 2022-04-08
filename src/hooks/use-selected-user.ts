import useSWR from "swr"

const useSelectedUser = () => {
  const { data, mutate } = useSWR("selected-user", null)

  return { selectedUser: data as User, setSelectedUser: mutate }
}

export default useSelectedUser
