import { request, gql } from "graphql-request"
import type { NextApiRequest, NextApiResponse } from "next"

import { reqIsGithub, getUsersList } from "@/utils/services/github"

const Endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  const githubUsersList = await getUsersList()

  await request(
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

    { githubData: { members: githubUsersList } }
  )

  res.status(200).send("OK")
}

export default Endpoint
