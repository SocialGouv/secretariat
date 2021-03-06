import pMap from "p-map"
import { setTimeout } from "timers/promises"

import { getJwt } from "@/utils/jwt"
import fetcher from "@/utils/fetcher"
import { getRemoteGithubTeams, getRemoteGithubUsers } from "@/queries/index"

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

export const fetchGithubUsers = async (
  msDelay: number
): Promise<Record<string, unknown>[]> => {
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
  return pMap(
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
}
