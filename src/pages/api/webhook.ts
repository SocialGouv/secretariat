import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'

export default (req: NextApiRequest, res: NextApiResponse) => {
  console.log('Headers from GH', req.headers)
  console.log('Data from GH', req.body)
  res.status(200).send('OK')
}

const isGithub = (req: NextApiRequest) => {
  const payload = JSON.stringify(req.body)
  const sig = req.headers["x-hub-signature"] || ""
  const hmac = crypto.createHmac("sha1", process.env.GITHUB_WEBHOOK_SECRET ?? "")
  const digest = Buffer.from(
    "sha1=" + hmac.update(payload).digest("hex"),
    "utf8"
  )
  const checksum = Buffer.from(String(sig), "utf8")
  return !(
    checksum.length !== digest.length ||
    !crypto.timingSafeEqual(digest, checksum)
  )
}
