import type { NextApiRequest, NextApiResponse } from "next"

import { reqIsGithub } from "@/services/github"
import GithubAPI from "@/services/APIs/GithubAPI"
import MatomoAPI from "@/services/APIs/MatomoAPI"
import SentryAPI from "@/services/APIs/SentryAPI"
import OVHAPI from "@/services/APIs/OVHAPI"

const Endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO run this only when deployed ?
  // if (!reqIsGithub(req)) {
  //   res.status(403).send("Forbidden")
  //   return
  // }

  new GithubAPI().fetchDataAndUpdateDatabase()
  new MatomoAPI().fetchDataAndUpdateDatabase()
  new SentryAPI().fetchDataAndUpdateDatabase()
  new OVHAPI().fetchDataAndUpdateDatabase()

  res.status(200).send("OK")
}

export default Endpoint
