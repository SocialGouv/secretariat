import useSWR from "swr"
import { request, gql } from "graphql-request"

import fetcher from "@/utils/fetcher"
import MatomoUsers from "@/components/matomo-users"
import Loader from "@/components/common/loader"

import useToken from "@/services/token"

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
  const [token] = useToken()

  const { data, error, isValidating } = useSWR("matomo", () =>
    fetcher(getMatomoUsersQuery, token)
  )

  console.log("DATA MATOMO", data)

  return Array.isArray(data) ? data : data?.services[0].matomo
}

export const MatomoUsersLoader = () => {
  const users = useMatomoUsers()

  if (!users) return <Loader />
  if (!users.length) return <div>Aucun utilisateur pour le moment...</div>

  return <MatomoUsers users={users} />
}
