import { fetchGithubUsers } from "@/services/fetchers/github"
import fetcher from "@/utils/fetcher"
import { gql } from "graphql-request"
import { fetchMatomoUsers } from "./fetchers/matomo"
import { fetchMattermostUsers } from "./fetchers/mattermost"
import { fetchNextcloudUsers } from "./fetchers/nextcloud"
import { fetchOvhUsers } from "./fetchers/ovh"
import { fetchZammadUsers } from "./fetchers/zammad"
import { fetchSentryUsers } from "./fetchers/sentry"

export const DEFAULT_DELAY = 0

const SERVICES = [
  "github",
  "matomo",
  "mattermost",
  "nextcloud",
  "ovh",
  "sentry",
  "zammad",
] as const

const servicesFetchers = {
  github: fetchGithubUsers,
  matomo: fetchMatomoUsers,
  mattermost: fetchMattermostUsers,
  nextcloud: fetchNextcloudUsers,
  ovh: fetchOvhUsers,
  sentry: fetchSentryUsers,
  zammad: fetchZammadUsers,
}

// export type FetchedData = Record<string, unknown> | Record<string, unknown>[]
export type FetchedData = Record<string, unknown>[]

const updateDbWithData = (
  serviceName: string,
  data: FetchedData,
  jwt: string
) => {
  fetcher(
    gql`
      mutation UpdateData($data: jsonb!) {
        update_services(where: {}, _set: { ${serviceName}: $data }) {
          returning {
            id
          }
        }
      }
`,
    jwt,
    { data }
  )
}

const emailMatchers: Record<string, string> = {
  github: "email",
  matomo: "email",
  zammad: "email",
  sentry: "email",
  nextcloud: "email",
  mattermost: "email",
  ovh: "primaryEmailAddress",
} as const

const idMatchers: Record<string, string> = {
  github: "id",
  matomo: "id",
  zammad: "id",
  sentry: "id",
  nextcloud: "id",
  mattermost: "id",
  ovh: "id",
} as const

const updateUsersTable = (
  users: Record<string, unknown>[],
  serviceName: string,
  jwt: string
) => {
  const matchUserInServices = gql`
    query matchUsersInServices($_or: [users_bool_exp!]) {
      users(where: { _or: $_or }) {
        id
      }
    }
  `

  const updateUser = gql`
    mutation updateUser($id: uuid!, $_set: users_set_input!) {
      update_users_by_pk(pk_columns: { id: $id }, _set: $_set) {
        id
      }
    }
  `

  const addUser = gql`
    mutation AddUser($user: users_insert_input!) {
      insert_users_one(object: $user) {
        id
      }
    }
  `

  users.forEach(async (user) => {
    const email = user[emailMatchers[serviceName]]
    const id = user[idMatchers[serviceName]]
    const { users: matchingRows } = await fetcher(matchUserInServices, jwt, {
      _or: SERVICES.map((service) => ({
        [service]: { _contains: { [emailMatchers[service]]: email } },
      })),
    })
    if (matchingRows.length === 0) {
      await fetcher(addUser, jwt, { user: { [serviceName]: user } })
    } else {
      await fetcher(updateUser, jwt, {
        id: matchingRows[0].id,
        _set: { [serviceName]: user },
      })
    }
  })
}

export const fetchAndUpdateServices = async (jwt: string) => {
  SERVICES.forEach(async (serviceName) => {
    const data = await servicesFetchers[serviceName]()
    updateUsersTable(data, serviceName, jwt)
    updateDbWithData(serviceName, data, jwt)
  })
}
