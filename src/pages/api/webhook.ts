import type { NextApiRequest, NextApiResponse } from "next"

import { reqIsGithub } from "@/services/github"
import GithubAPI from "@/services/APIs/GithubAPI"
import MatomoAPI from "@/services/APIs/MatomoAPI"
import SentryAPI from "@/services/APIs/SentryAPI"
import OVHAPI from "@/services/APIs/OVHAPI"
import ZammadAPI from "@/services/APIs/ZammadAPI"
import { getJwt } from "@/utils/jwt"
import NextcloudAPI from "@/services/APIs/NextcloudAPI"

const Endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO run this only when deployed ?
  // if (!reqIsGithub(req)) {
  //   res.status(403).send("Forbidden")
  //   return
  // }

  // Get the JWT needed to query Hasura with update privileges
  const jwt = getJwt("webhook")

  new GithubAPI().fetch_data_and_update_database(jwt)
  new MatomoAPI().fetch_data_and_update_database(jwt)
  new SentryAPI().fetch_data_and_update_database(jwt)
  new OVHAPI().fetch_data_and_update_database(jwt)
  new ZammadAPI().fetch_data_and_update_database(jwt)
  new NextcloudAPI().fetch_data_and_update_database(jwt)

  res.status(200).send("OK")
}

export default Endpoint
