import useSWR from "swr"

import { useFilteredUsers } from "@/services/users"

const useGithubUsers = () => {
  const { query, users } = useFilteredUsers()

  const { data } = useSWR(users ? `github-users/${query}` : null, () =>
    users?.reduce(
      (users, user) => (user.github && users.push(user), users),
      [] as User[]
    )
  )

  return data
}

export default useGithubUsers
