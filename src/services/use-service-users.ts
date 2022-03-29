import useSWR from "swr"
import useFilteredUsers from "@/services/use-filtered-users"

const useServiceUsers = (service?: keyof User) => {
  const { query, users } = useFilteredUsers()

  const { data } = useSWR(
    service && users ? `${service}-users/${query}` : null,
    () =>
      users?.reduce(
        (users, user) => (service && user[service] && users.push(user), users),
        [] as User[]
      )
  )

  return data
}

export default useServiceUsers
