import { request, gql } from "graphql-request"
import crypto from "crypto"
import type { NextApiRequest } from "next"

export const reqIsGithub = (req: NextApiRequest) => {
  const payload = JSON.stringify(req.body)
  const sig = req.headers["x-hub-signature"] || ""
  const hmac = crypto.createHmac(
    "sha1",
    process.env.GITHUB_WEBHOOK_SECRET ?? "undefined"
  )
  const digest = Buffer.from(
    "sha1=" + hmac.update(payload).digest("hex"),
    "utf8"
  )
  const checksum = Buffer.from(String(sig), "utf8")
  return !(
    checksum.length !== digest.length ||
    !crypto.timingSafeEqual(digest, checksum)
  )
}

export const getUsersList = async () => {
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
export const updateData = (data: object) => {
  request(
    process.env.NEXT_PUBLIC_HASURA_URL ?? "undefined",
    gql`
      mutation UpdateGithubData($githubData: jsonb!) {
        update_services(where: {}, _set: { github: $githubData }) {
          returning {
            id
          }
        }
      }
    `,

    { githubData: data }
  )
}
