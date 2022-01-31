import { request, gql } from "graphql-request"
import type { NextApiRequest, NextApiResponse } from "next"

import {
  reqIsGithub,
  getUsersListFromGithub,
  updateGithubData,
} from "@/services/github"

const Endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  // if (!reqIsGithub(req)) {
  //   res.status(403).send("Forbidden")
  //   return
  // }

  const githubUsersList = getUsersListFromGithub()
  updateGithubData({ members: githubUsersList })

    { githubData: { members: githubUsersList } }
  )

  res.status(200).send("OK")
}

export default Endpoint
