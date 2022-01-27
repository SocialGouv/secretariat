import { request, gql } from "graphql-request"
import type { NextApiRequest, NextApiResponse } from "next"
import crypto from "crypto"

// TODO not used for now
const isGithub = (req: NextApiRequest) => {
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

const Endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Request is Github", isGithub(req))
  console.log("Headers from Github webhook", req.headers)
  console.log("Data from Github webhook", req.body)

  const query = gql`
    {
      organization(login: "SocialGouv") {
        teams(first: 5) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            name
            members(first: 3) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                id
              }
            }
          }
        }
      }
    }
  `
  const data = await request(
    process.env.NEXT_PUBLIC_HASURA_URL ?? "undefined",
    query
  )
  console.log("Github data", data)

  res.status(200).send("OK")
}

export default Endpoint
