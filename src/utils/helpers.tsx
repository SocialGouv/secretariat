import useSWR from "swr"

import fetcher from "@/utils/fetcher"
import { gql } from "graphql-request"
import Loader from "@/components/common/loader"
import Users from "@/components/users"

const getGitHubUsersQuery = gql`
  query getGithubUsers {
    services {
      github
    }
  }
`

export const getGitHubUsers = async () => {
  const data = await fetcher(getGitHubUsersQuery)

  return data
}

const useUsers = () => {
  const { data, error, isValidating } = useSWR("teams", () =>
    fetcher(getGitHubUsersQuery)
  )

  return Array.isArray(data)
    ? data
    : data?.github_data[0].admins_and_teams.teams
}

export const UsersLoader = () => {
  const users = useUsers()

  if (!users) return <Loader />
  if (!users.length) return <div>Aucun utilisateur pour le moment...</div>

  return <Users users={users} />
}
