import fetcher from "@/utils/fetcher"
import { getJwt } from "@/utils/jwt"
import { checkEnv } from "@/utils/services-fetching"
import { FetchedData } from "@/utils/services-fetching"
import { getRemoteGithubUsers } from "@/queries/index"

const fetchGithubPage = async (jwt: string, cursor?: string) => {
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

export const github = async (): Promise<FetchedData> => {
  const jwt = getJwt("admin")
  const data = []

  let { usersPage, hasNextPage, endCursor } = await fetchGithubPage(jwt)
  data.push(...usersPage)

  while (hasNextPage) {
    ;({ usersPage, hasNextPage, endCursor } = await fetchGithubPage(
      jwt,
      endCursor
    ))
    data.push(...usersPage)
  }

  return data
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

export const nextcloud = async (): Promise<FetchedData> => {
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

  const rawData = await response.json()
  const data = rawData.ocs.data.users.map((login: string) => {
    return { login }
  })
  return data
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
