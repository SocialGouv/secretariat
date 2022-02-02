import AbstractServiceAPI from "@/services/APIs/AbstractServiceAPI"
import fetcher from "@/utils/fetcher"
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
    } = await fetcher(githubUsersQuery, jwt)

    githubUsersList.push(...githubUsersPage)

    while (hasNextPage) {
      ;({
        organization: {
          membersWithRole: {
            nodes: githubUsersPage,
            pageInfo: { hasNextPage, endCursor },
          },
        },
      } = await fetcher(githubUsersQuery, jwt, { cursor: endCursor }))
      githubUsersList.push(...githubUsersPage)
    }

    return githubUsersList
  }
}

export default GithubAPI
