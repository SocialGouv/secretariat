import AbstractServiceAPI from "@/services/APIs/AbstractServiceAPI"
import { request, gql } from "graphql-request"

class GithubAPI extends AbstractServiceAPI {
  serviceName = "github"

  async fetchData(): Promise<object> {
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
      githubUsersQuery
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
        { cursor: endCursor }
      ))
      githubUsersList.push(...githubUsersPage)
    }

    return githubUsersList
  }
}

export default GithubAPI
