import { fetchGithubUsers } from "@/services/fetchers/github"
import fetcher from "@/utils/fetcher"
import { gql } from "graphql-request"
import { fetchMatomoUsers } from "./fetchers/matomo"
import { fetchMattermostUsers } from "./fetchers/mattermost"
import { fetchNextcloudUsers } from "./fetchers/nextcloud"
import { fetchOvhUsers } from "./fetchers/ovh"
import { fetchZammadUsers } from "./fetchers/zammad"
import { fetchSentryUsers } from "./fetchers/sentry"

export const DEFAULT_DELAY = 100

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

const keys: Record<string, string> = {
  github: "id",
  matomo: "email",
  zammad: "email",
  sentry: "email",
  nextcloud: "email",
  mattermost: "email",
  ovh: "primaryEmailAddress",
}

const getServicesToMatch = (value: string, serviceName: string) => {
  const services = []
  const matcher = keys[serviceName]

  for (const service in keys) {
    if (service !== serviceName) {
      services.push({ [service]: { _contains: { [matcher]: value } } })
    }
  }

  return services
}

const updateUsersTable = (
  users: Record<string, unknown>[],
  serviceName: string,
  jwt: string
) => {
  let matchingCount = 0
  const getServiceUsers = gql`
    query getServiceUsers($_contains: jsonb) {
      users(where: { ${serviceName}: { _contains: $_contains } }) {
        id
      }
    }
  `
  const matchUserInServices = gql`
    query matchUsersInServices($_or: [users_bool_exp!]) {
      users(where: { _or: $_or }) {
        id
      }
    }
  `

  const updateUser = gql`
    mutation MyMutation($id: uuid, $_set: users_set_input) {
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

  const matcher = keys[serviceName]

  users.forEach(async (user) => {
    const value = user[matcher] as string
    const existingUsers = await fetcher(getServiceUsers, jwt, {
      _contains: { [matcher]: value },
    })
    console.log("got existing users", existingUsers)
    if (!existingUsers.length) {
      console.log("EXISTING USER NOT FOUND")
      const params = getServicesToMatch(value, serviceName)
      console.log("params", params)
      const existingUserInService = await fetcher(matchUserInServices, jwt, {
        _or: params,
      })
      if (!existingUserInService.length) {
        console.log("EXISTING USER IN SERVICE NOT FOUND")
        await fetcher(addUser, jwt, { user: { [serviceName]: user } })
      } else {
        console.log("EXISTING USER IN SERVICE FOUND", existingUserInService[0])
        matchingCount++
        await fetcher(updateUser, jwt, {
          id: existingUserInService[0].id,
          _set: { [serviceName]: user },
        })
        // menage...
      }
    } else {
      console.log("EXISTING USER FOUND", existingUsers[0])
      await fetcher(updateUser, jwt, {
        id: existingUsers[0].id,
        _set: { [serviceName]: user },
      })
    }
  })

  console.log("matchingCount", matchingCount)
}

export const fetchAndUpdateServices = async (jwt: string) => {
  SERVICES.forEach(async (serviceName) => {
    const data = await servicesFetchers[serviceName]()
    updateUsersTable(data, serviceName, jwt)
    updateDbWithData(serviceName, data, jwt)
  })
}
