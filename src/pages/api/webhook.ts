import { createHmac, timingSafeEqual } from "crypto"

import type { NextApiRequest, NextApiResponse } from "next"

import { getJwt } from "@/utils/jwt"
import { GITHUB_WEBHOOK_SECRET } from "@/utils/env"
import fetchAndUpdateServices from "@/services/fetch"

const reqIsGithub = (req: NextApiRequest) => {
  const payload = JSON.stringify(req.body)
  const sig = req.headers["x-hub-signature"] || ""
  const hmac = createHmac("sha1", GITHUB_WEBHOOK_SECRET)
  const digest = Buffer.from(
    "sha1=" + hmac.update(payload).digest("hex"),
    "utf8"
  )
  const checksum = Buffer.from(String(sig), "utf8")
  return !(
    checksum.length !== digest.length || !timingSafeEqual(digest, checksum)
  )
}

const Endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO run this only when deployed ?
  // if (!reqIsGithub(req)) {
  //   res.status(403).send("Forbidden")
  //   return
  // }

  // Get the JWT needed to query Hasura with update privileges
  const jwt = getJwt("webhook")

  fetchAndUpdateServices(jwt)

  res.status(200).send("OK")
}

export default Endpoint
