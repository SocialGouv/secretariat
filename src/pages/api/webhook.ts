import type { NextApiRequest, NextApiResponse } from "next"

import { reqIsGithub } from "@/services/github"
import GithubAPI from "@/services/APIs/GithubAPI"
import MatomoAPI from "@/services/APIs/MatomoAPI"
import SentryAPI from "@/services/APIs/SentryAPI"
import OVHAPI from "@/services/APIs/OVHAPI"
import ZammadAPI from "@/services/APIs/ZammadAPI"
import { getJwt } from "@/utils/jwt"

const Endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO run this only when deployed ?
  // if (!reqIsGithub(req)) {
  //   res.status(403).send("Forbidden")
  //   return
  // }

  // Get the JWT needed to query Hasura with update privileges
  const jwt = getJwt("webhook")

  new GithubAPI().fetchDataAndUpdateDatabase(jwt)
  new MatomoAPI().fetchDataAndUpdateDatabase(jwt)
  new SentryAPI().fetchDataAndUpdateDatabase(jwt)
  new OVHAPI().fetchDataAndUpdateDatabase(jwt)
  new ZammadAPI().fetchDataAndUpdateDatabase(jwt)

  res.status(200).send("OK")
}

export default Endpoint
