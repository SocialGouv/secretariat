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

const data = [
  {
    id: "MDQ6VXNlcjU0MA==",
    name: "Antoine Millet",
    email: "",
    login: "NaPs",
  },
  {
    id: "MDQ6VXNlcjEyNDkzNw==",
    name: "Julien Bouquillon",
    email: "julien@bouquillon.com",
    login: "revolunet",
  },
  {
    id: "MDQ6VXNlcjE0NjAyMw==",
    name: "Yohan Boniface",
    email: "",
    login: "yohanboniface",
  },
  {
    id: "MDQ6VXNlcjE2MDMyMA==",
    name: "Lionel",
    email: "lionel.breduillieard@beta.gouv.fr",
    login: "lionelB",
  },
  {
    id: "MDQ6VXNlcjE2Nzc2Nw==",
    name: "Mathieu Agopian",
    email: "",
    login: "magopian",
  },
]

export const getGitHubUsers = async () => {
  // const data = await fetcher(getGitHubUsersQuery)

  return data
}

const useUsers = () => {
  // const { data, error, isValidating } = useSWR("teams", () =>
  //   fetcher(getGitHubUsersQuery)
  // )

  // return Array.isArray(data)
  //   ? data
  //   : data?.github_data[0].admins_and_teams.teams

  return data
}

export const UsersLoader = () => {
  const users = useUsers()

  if (!users) return <Loader />
  if (!users.length) return <div>Aucun utilisateur pour le moment...</div>

  return <Users users={users} />
}
