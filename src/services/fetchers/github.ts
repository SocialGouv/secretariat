import pMap from "p-map"
import { setTimeout } from "timers/promises"

import { getJwt } from "@/utils/jwt"
import graphQLFetcher from "@/utils/graphql-fetcher"
import { getRemoteGithubTeams, getRemoteGithubUsers } from "@/queries/index"

const fetchGithubPage = async (token: string, cursor?: string) => {
  // if it is the query for the first page, we don't have a cursor
  const parameters = cursor ? { cursor } : {}
  const {
    organization: {
      membersWithRole: {
        nodes: usersPage,
        pageInfo: { hasNextPage, endCursor },
      },
    },
  } = await graphQLFetcher({ query: getRemoteGithubUsers, token, parameters })

  return { usersPage, hasNextPage, endCursor }
}

export const fetchGithubUsers = async (
  msDelay: number
): Promise<Record<string, unknown>[]> => {
  // accessing an Hasura remote schema requires admin rights
  const token = getJwt()

  const users = []
  let { usersPage, hasNextPage, endCursor } = await fetchGithubPage(token)
  users.push(...usersPage)

  while (hasNextPage) {
    await setTimeout(msDelay) // so that we don't spam the remote API
    ;({ usersPage, hasNextPage, endCursor } = await fetchGithubPage(
      token,
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
      } = await graphQLFetcher({
        query: getRemoteGithubTeams,
        token,
        parameters: {
          userLogins: user.login,
        },
      })
      console.log(`fetched teams for Github user ${index + 1}/${users.length}`)
      await setTimeout(msDelay) // so that we don't spam the remote API
      return { ...user, teams: teamsList }
    },
    { concurrency: 1 }
  )
}
