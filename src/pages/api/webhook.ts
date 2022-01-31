import { request, gql } from "graphql-request"
import type { NextApiRequest, NextApiResponse } from "next"

import { reqIsGithub } from "@/services/github"
import GithubAPI from "@/services/APIs/GithubAPI"
import MatomoAPI from "@/services/APIs/MatomoAPI"
import SentryAPI from "@/services/APIs/SentryAPI"

const Endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO run this only when deployed ?
  // if (!reqIsGithub(req)) {
  //   res.status(403).send("Forbidden")
  //   return
  // }

  new GithubAPI().fetchDataAndUpdateDatabase()
  new MatomoAPI().fetchDataAndUpdateDatabase()
  new SentryAPI().fetchDataAndUpdateDatabase()

  res.status(200).send("OK")
}

export default Endpoint
