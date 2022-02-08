import fetcher from "@/utils/fetcher"
import { getJwt } from "@/utils/jwt"
import { checkEnv } from "@/utils/services-fetching"
import { FetchedData } from "@/utils/services-fetching"
import { getRemoteGithubUsers, getRemoteGithubTeams } from "@/queries/index"

const DEFAULT_DELAY = 100

// Used to `await delay(ms)` before queries we want to delay
const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
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
    await delay(msDelay) // so that we don't spam the remote API
    ;({ usersPage, hasNextPage, endCursor } = await fetchGithubPage(
      jwt,
      endCursor
    ))
    users.push(...usersPage)
  }

  // Update each user with its teams
  const usersWithTeams = Promise.all(
    users.map(async (user, index) => {
      await delay(index * msDelay)
      const {
        organization: {
          teams: { nodes: teamsList },
        },
      } = await fetcher(getRemoteGithubTeams, jwt, { userLogins: user.login })
      console.log(`fetching teams for Github user ${index + 1}/${users.length}`)
      return { ...user, teams: teamsList }
    })
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
  }: {
    ocs: {
      data: { users: string[] }
    }
  } = await response.json()
  const users = await Promise.all(
    logins.map(async (login: string, index: number) => {
      await delay(index * msDelay)
      const {
        ocs: { data: user },
      } = await fetchNextcloudUser(login)
      console.log(`fetching Nextcloud user ${index + 1}/${logins.length}`)
      return user
    })
  )
  return users
}

export const ovh = async (): Promise<FetchedData> => {
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

  const response = await ovh.requestPromised(
    "GET",
    `/email/pro/${process.env.OVH_SERVICE_NAME}/account`
  )
  const data = response.map((email: string) => ({
    email,
  }))
  return data
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
