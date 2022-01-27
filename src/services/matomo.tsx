import useSWR from "swr"
import { gql } from "graphql-request"

import fetcher from "@/utils/fetcher"
import MatomoUsers from "@/components/matomo-users"
import Loader from "@/components/common/loader"

const getMatomoUsersQuery = gql`
  query getMatomoUsers {
    services {
      matomo
    }
  }
`

export const getMatomoUsers = async () => {
  const data = await fetcher(getMatomoUsersQuery)

  return data
}

const useMatomoUsers = () => {
  const { data, error, isValidating } = useSWR("teams", () =>
    fetcher(getMatomoUsersQuery)
  )

  return Array.isArray(data)
    ? data
    : data?.Matomo_data[0].admins_and_teams.teams

  return data
}

export const MatomoUsersLoader = () => {
  const users = useMatomoUsers()

  if (!users) return <Loader />
  if (!users.length) return <div>Aucun utilisateur pour le moment...</div>

  return <MatomoUsers users={users} />
}
