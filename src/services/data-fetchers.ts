import { getRemoteGithubTeams, getRemoteGithubUsers } from "@/queries/index"
import fetcher from "@/utils/fetcher"
import { getJwt } from "@/utils/jwt"
import { gql } from "graphql-request"
import pMap from "p-map"
import { setTimeout } from "timers/promises"

const DEFAULT_DELAY = 100

export type FetchedData = Record<string, unknown> | Record<string, unknown>[]

// Each service fetcher requires some credentials or a token to work
export const checkEnv = (envVars: string[]) => {
  envVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw ReferenceError(`Could not find ${envVar} environment variable`)
    }
  })
}

export const updateDbWithData = (
  serviceName: string,
  data: FetchedData,
  jwt: string
) => {
  checkEnv(["NEXT_PUBLIC_HASURA_URL"])

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

// We have too many users to receive them all in the first page
const fetchGithubPage = async (jwt: string, cursor?: string) => {
  // if it is the query for the first page, we don't have a cursor
  const params = cursor ? { cursor } : {}
  const {
    organization: {
      membersWithRole: {
        nodes: usersPage,
        pageInfo: { hasNextPage, endCursor },
      },
    },
  } = await fetcher(getRemoteGithubUsers, jwt, params)

  return { usersPage, hasNextPage, endCursor }
}

export const github = async (msDelay = DEFAULT_DELAY): Promise<FetchedData> => {
  // accessing an Hasura remote schema requires admin rights
  const jwt = getJwt("admin")

  const users = []
  let { usersPage, hasNextPage, endCursor } = await fetchGithubPage(jwt)
  users.push(...usersPage)

  while (hasNextPage) {
    await setTimeout(msDelay) // so that we don't spam the remote API
    ;({ usersPage, hasNextPage, endCursor } = await fetchGithubPage(
      jwt,
      endCursor
    ))
    users.push(...usersPage)
  }

  // Update each user with its teams
  const usersWithTeams = pMap(
    users,
    async (user, index) => {
      const {
        organization: {
          teams: { nodes: teamsList },
        },
      } = await fetcher(getRemoteGithubTeams, jwt, { userLogins: user.login })
      console.log(`fetched teams for Github user ${index + 1}/${users.length}`)
      await setTimeout(msDelay) // so that we don't spam the remote API
      return { ...user, teams: teamsList }
    },
    { concurrency: 1 }
  )
  return usersWithTeams
}

export const mattermost = async (): Promise<FetchedData> => {
  checkEnv(["MATTERMOST_API_TOKEN"])
  const response = await fetch(
    "https://mattermost.fabrique.social.gouv.fr/api/v4/users",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.MATTERMOST_API_TOKEN}`,
      },
    }
  )
  return response.json()
}

export const matomo = async (): Promise<FetchedData> => {
  checkEnv(["MATOMO_API_TOKEN"])
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
  return response.json()
}

const fetchNextcloudUser = async (login: string) => {
  const user = await fetch(
    `https://nextcloud.fabrique.social.gouv.fr/ocs/v1.php/cloud/users/${login}`,
    {
      method: "GET",
      headers: {
        "OCS-APIRequest": " true",
        Accept: " application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXTCLOUD_API_LOGIN}:${process.env.NEXTCLOUD_API_SECRET}`
        ).toString("base64")}`,
      },
    }
  )
  return user.json()
}

export const nextcloud = async (
  msDelay = DEFAULT_DELAY
): Promise<FetchedData> => {
  checkEnv(["NEXTCLOUD_API_LOGIN", "NEXTCLOUD_API_SECRET"])
  const response = await fetch(
    "https://nextcloud.fabrique.social.gouv.fr/ocs/v1.php/cloud/users",
    {
      method: "GET",
      headers: {
        "OCS-APIRequest": " true",
        Accept: " application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXTCLOUD_API_LOGIN}:${process.env.NEXTCLOUD_API_SECRET}`
        ).toString("base64")}`,
      },
    }
  )

  // Nextcloud only sends us a list of logins, we need to query each user's details
  const {
    ocs: {
      data: { users: logins },
    },
  } = await response.json()
  const users = pMap(
    logins,
    async (login: string, index: number) => {
      const {
        ocs: { data: user },
      } = await fetchNextcloudUser(login)
      console.log(`fetched Nextcloud user ${index + 1}/${logins.length}`)
      await setTimeout(msDelay)
      return user
    },
    { concurrency: 1 }
  )

  return users
}

const fetchOvhUser = async (ovh: any, email: string) => {
  const user = await ovh.requestPromised(
    "GET",
    `/email/pro/${process.env.OVH_SERVICE_NAME}/account/${email}`
  )
  return user
}

export const ovh = async (msDelay = DEFAULT_DELAY): Promise<FetchedData> => {
  checkEnv([
    "OVH_APP_KEY",
    "OVH_APP_SECRET",
    "OVH_CONSUMER_KEY",
    "OVH_SERVICE_NAME",
  ])
  const ovh = require("ovh")({
    endpoint: "ovh-eu",
    appKey: process.env.OVH_APP_KEY,
    appSecret: process.env.OVH_APP_SECRET,
    consumerKey: process.env.OVH_CONSUMER_KEY,
  })

  const emails = await ovh.requestPromised(
    "GET",
    `/email/pro/${process.env.OVH_SERVICE_NAME}/account`
  )

  // OVH only sends us a list of emails, we need to query each user's details
  const users = pMap(
    emails,
    async (email: string, index: number) => {
      const user = await fetchOvhUser(ovh, email)
      console.log(`fetched OVH user ${index + 1}/${emails.length}`)
      await setTimeout(msDelay)
      return user
    },
    { concurrency: 1 }
  )
  return users
}

export const sentry = async (): Promise<FetchedData> => {
  checkEnv(["SENTRY_API_TOKEN"])
  const response = await fetch(
    "https://sentry.fabrique.social.gouv.fr/api/0/organizations/incubateur/users/",
    {
      method: "GET",
      headers: {
        Authorization: process.env.SENTRY_API_TOKEN as string,
      },
    }
  )
  return response.json()
}

export const zammad = async (): Promise<FetchedData> => {
  checkEnv(["ZAMMAD_API_TOKEN"])
  const response = await fetch(
    "https://pastek.fabrique.social.gouv.fr/api/v1/users",
    {
      method: "GET",
      headers: {
        Authorization: process.env.ZAMMAD_API_TOKEN as string,
      },
    }
  )
  return response.json()
}

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
  github,
  matomo,
  mattermost,
  nextcloud,
  ovh,
  sentry,
  zammad,
}

export const fetchAndUpdateServices = (jwt: string) => {
  SERVICES.forEach(async (serviceName) => {
    const data = await servicesFetchers[serviceName]()
    updateDbWithData(serviceName, data, jwt)
  })
}
