import AbstractServiceAPI from "@/services/APIs/AbstractServiceAPI"
import { getJwt } from "@/utils/jwt"
import { request, gql } from "graphql-request"

class GithubAPI extends AbstractServiceAPI {
  serviceName = "github"

  async fetchData(): Promise<object> {
    const jwt = getJwt("admin")

    const githubUsersList = []
    const githubUsersQuery = gql`
      query GetGithubUsers($cursor: String) {
        organization(login: "SocialGouv") {
          membersWithRole(first: 100, after: $cursor) {
            nodes {
              id
              name
              email
              login
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    `
    let {
      organization: {
        membersWithRole: {
          nodes: githubUsersPage,
          pageInfo: { hasNextPage, endCursor },
        },
      },
    } = await request(
      process.env.NEXT_PUBLIC_HASURA_URL ?? "undefined",
      githubUsersQuery,
      {},
      { Authorization: `Bearer ${jwt}` }
    )

    githubUsersList.push(...githubUsersPage)

    while (hasNextPage) {
      ;({
        organization: {
          membersWithRole: {
            nodes: githubUsersPage,
            pageInfo: { hasNextPage, endCursor },
          },
        },
      } = await request(
        process.env.NEXT_PUBLIC_HASURA_URL ?? "undefined",
        githubUsersQuery,
        { cursor: endCursor },
        { Authorization: `Bearer ${jwt}` }
      ))
      githubUsersList.push(...githubUsersPage)
    }

    return githubUsersList
  }
}

export default GithubAPI
