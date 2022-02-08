import useSWR from "swr"
import crypto from "crypto"
import type { NextApiRequest } from "next"

import fetcher from "@/utils/fetcher"
import useToken from "@/services/token"
import { getGitHubUsers } from "@/queries/index"

const useGithubUsers = () => {
  const [token] = useToken()

  const { data, error } = useSWR(
    token ? [getGitHubUsers, token] : null,
    fetcher
  )

  console.log("useGithubUsers:", data, error, token)

  return Array.isArray(data) ? data : data?.services[0].github
}

export const reqIsGithub = (req: NextApiRequest) => {
  const payload = JSON.stringify(req.body)
  const sig = req.headers["x-hub-signature"] || ""
  const hmac = crypto.createHmac(
    "sha1",
    process.env.GITHUB_WEBHOOK_SECRET as string
  )
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

export default useGithubUsers
