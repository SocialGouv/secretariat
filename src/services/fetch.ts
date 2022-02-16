import { fetchGithubUsers } from "@/services/fetchers/github"
import fetcher from "@/utils/fetcher"
import { gql } from "graphql-request"
import { fetchMatomoUsers } from "./fetchers/matomo"
import { fetchMattermostUsers } from "./fetchers/mattermost"
import { fetchNextcloudUsers } from "./fetchers/nextcloud"
import { fetchOvhUsers } from "./fetchers/ovh"
import { fetchSentryUsers } from "./fetchers/sentry"
import { fetchZammadUsers } from "./fetchers/zammad"

export const DEFAULT_DELAY = 800

const SERVICES = [
  "github",
  // "matomo",
  "mattermost",
  // "nextcloud",
  "ovh",
  "sentry",
  // "zammad",
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

const updateDbWithData = (
  serviceName: string,
  data: Record<string, unknown>[],
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

const updateUsersTable = async (
  users: Record<string, unknown>[],
  serviceName: string,
  jwt: string
) => {
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
        github
        matomo
        zammad
        sentry
        nextcloud
        mattermost
        ovh
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

  await Promise.all(
    users.map(async (user) => {
      const email = user[emailMatchers[serviceName]]

      if (!email) {
        // if we don't have the email
        const { users: matchingIdUsers } = await fetcher(getServiceUsers, jwt, {
          _contains: { id: user.id },
        })
        if (matchingIdUsers.length === 0) {
          // if there's not row with this id for the given service, insert the user
          await fetcher(addUser, jwt, { user: { [serviceName]: user } })
        } else if (matchingIdUsers.length === 1) {
          // if there's one, update the user
          await fetcher(updateUser, jwt, {
            id: matchingIdUsers[0].id,
            _set: { [serviceName]: user },
          })
        } else {
          // this is not supposed to happen
          console.error("More than one row had this id", matchingIdUsers)
        }
      } else {
        // if we have the email
        const { users: matchingRows } = await fetcher(
          matchUserInServices,
          jwt,
          {
            _or: SERVICES.map((service) => ({
              [service]: { _contains: { [emailMatchers[service]]: email } },
            })),
          }
        )
        if (matchingRows.length === 0) {
          // no row have the same email on any service, create the user
          await fetcher(addUser, jwt, { user: { [serviceName]: user } })
        } else if (matchingRows.length === 1) {
          // an row have the same email on a service, update the user
          await fetcher(updateUser, jwt, {
            id: matchingRows[0].id,
            _set: { [serviceName]: user },
          })
        } else {
          // this is not supposed to happen ?
          console.error("More than one row had this email")
        }
      }
    })
  )
}

export const fetchAndUpdateServices = async (jwt: string) => {
  // store all fetched data to update users table sequentially afterwards
  const usersByService: Record<string, Record<string, unknown>[]> = {}
  await Promise.all(
    SERVICES.map(async (serviceName) => {
      const users = await servicesFetchers[serviceName]()
      usersByService[serviceName] = users
      updateDbWithData(serviceName, users, jwt)
    })
  )
  for (const service of Object.keys(usersByService)) {
    // update users table for each service sequentially to detect possible merges
    await updateUsersTable(usersByService[service], service, jwt)
  }
}
