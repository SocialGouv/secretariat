import { getJwt } from "@/utils/jwt"
import { fetch_and_update_services } from "@/utils/services_fetching"
import type { NextApiRequest, NextApiResponse } from "next"

const Endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO run this only when deployed ?
  // if (!reqIsGithub(req)) {
  //   res.status(403).send("Forbidden")
  //   return
  // }

  // Get the JWT needed to query Hasura with update privileges
  const jwt = getJwt("webhook")

  fetch_and_update_services(jwt)

  res.status(200).send("OK")
}

export default Endpoint
