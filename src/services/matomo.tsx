import useSWR from "swr"
import { request, gql } from "graphql-request"

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
  const { data, error, isValidating } = useSWR("matomo", () =>
    fetcher(getMatomoUsersQuery)
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

export const getUsersListFromMatomo = async () => {
  const response = await fetch(
    "https://matomo.fabrique.social.gouv.fr/index.php",
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: `module=API&method=UsersManager.getUsers&format=json&token_auth=${process.env.MATOMO_API_TOKEN}`,
    }
  )
  return await response.json()
}

export const updateMatomoData = (data: object) => {
  request(
    process.env.NEXT_PUBLIC_HASURA_URL ?? "undefined",
    gql`
      mutation UpdateMatomoData($matomoData: jsonb!) {
        update_services(where: {}, _set: { matomo: $matomoData }) {
          returning {
            id
          }
        }
      }
    `,

    { matomoData: data }
  )
}
