import useSWR from "swr"
import { gql } from "graphql-request"

import fetcher from "@/utils/fetcher"
import Users from "@/components/github-users"
import Loader from "@/components/common/loader"

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

const useGithubUsers = () => {
  const { data, error, isValidating } = useSWR("teams", () =>
    fetcher(getGitHubUsersQuery)
  )

  return Array.isArray(data)
    ? data
    : data?.github_data[0].admins_and_teams.teams

  return data
}

export const GithubUsersLoader = () => {
  const users = useGithubUsers()

  if (!users) return <Loader />
  if (!users.length) return <div>Aucun utilisateur pour le moment...</div>

  return <Users users={users} />
}
