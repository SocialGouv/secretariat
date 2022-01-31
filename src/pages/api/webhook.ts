import { request, gql } from "graphql-request"
import type { NextApiRequest, NextApiResponse } from "next"

import {
  reqIsGithub,
  getUsersListFromGithub,
  updateGithubData,
} from "@/services/github"
import { getUsersListFromMatomo, updateMatomoData } from "@/services/matomo"

const Endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO run this only when deployed ?
  // if (!reqIsGithub(req)) {
  //   res.status(403).send("Forbidden")
  //   return
  // }

  const githubUsersList = await getUsersListFromGithub()
  updateGithubData({ members: githubUsersList })

  const matomoUsersList = await getUsersListFromMatomo()
  updateMatomoData(matomoUsersList)

  res.status(200).send("OK")
}

export default Endpoint
