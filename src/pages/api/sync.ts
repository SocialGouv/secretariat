import sync from "@/services/sync"
import { GITHUB_WEBHOOK_SECRET } from "@/utils/env"
import { createHmac, timingSafeEqual } from "crypto"
import type { NextApiRequest, NextApiResponse } from "next"

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

const Sync = async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO run this only when deployed ?
  // if (!reqIsGithub(req)) {
  //   res.status(403).send("Forbidden")
  //   return
  // }

  sync()
  res.status(202).end()
}

export default Sync
