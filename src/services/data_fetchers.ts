import fetcher from "@/utils/fetcher"
import { getJwt } from "@/utils/jwt"
import { check_env } from "@/utils/services_fetching"
import { gql } from "graphql-request"
import { FetchedData } from "@/utils/services_fetching"

const githubUsersQuery = gql`
  query GetGithubUsers($cursor: String) {
    organization(login: "SocialGouv") {
      membersWithRole(first: 100, after: $cursor) {
        nodes {
          id
          name
          email
          login
          avatarUrl
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`
const fetch_github_page = async (jwt: string, cursor?: string) => {
  const params = cursor ? { cursor } : {}
  const {
    organization: {
      membersWithRole: {
        nodes: users_page,
        pageInfo: { hasNextPage: has_next_page, endCursor: end_cursor },
      },
    },
  } = await fetcher(githubUsersQuery, jwt, params)

  return { users_page, has_next_page, end_cursor }
}

export const github = async (): Promise<FetchedData> => {
  const jwt = getJwt("admin")
  const data = []

  let { users_page, has_next_page, end_cursor } = await fetch_github_page(jwt)
  data.push(...users_page)

  while (has_next_page) {
    ;({ users_page, has_next_page, end_cursor } = await fetch_github_page(
      jwt,
      end_cursor
    ))
    data.push(...users_page)
  }

  return data
}

export const mattermost = async (): Promise<FetchedData> => {
  check_env(["MATTERMOST_API_TOKEN"])
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
  check_env(["MATOMO_API_TOKEN"])
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
  check_env(["NEXTCLOUD_API_LOGIN", "NEXTCLOUD_API_SECRET"])
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

  const raw_data = await response.json()
  const data = raw_data.ocs.data.users.map((login: string) => {
    return { login }
  })
  return data
}

export const ovh = async (): Promise<FetchedData> => {
  check_env([
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
  check_env(["SENTRY_API_TOKEN"])
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
  check_env(["ZAMMAD_API_TOKEN"])
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
