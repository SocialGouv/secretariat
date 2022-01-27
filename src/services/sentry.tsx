import useSWR from "swr"
import { gql } from "graphql-request"

import fetcher from "@/utils/fetcher"
import Users from "@/components/sentry-users"
import Loader from "@/components/common/loader"

const getSentryUsersQuery = gql`
  query getSentryUsers {
    services {
      sentry
    }
  }
`

export const getSentryUsers = async () => {
  const data = await fetcher(getSentryUsersQuery)

  return data
}

const useSentryUsers = () => {
  const { data, error, isValidating } = useSWR("teams", () =>
    fetcher(getSentryUsersQuery)
  )

  return Array.isArray(data)
    ? data
    : data?.Sentry_data[0].admins_and_teams.teams

  return data
}

export const SentryUsersLoader = () => {
  const users = useSentryUsers()

  if (!users) return <Loader />
  if (!users.length) return <div>Aucun utilisateur pour le moment...</div>

  return <Users users={users} />
}
