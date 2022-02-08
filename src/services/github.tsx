import type { NextApiRequest } from "next"

import useSWR from "swr"
import crypto from "crypto"

import fetcher from "@/utils/fetcher"
import useToken from "@/services/token"
import Users from "@/components/github-users"
import Loader from "@/components/common/loader"
import { getGitHubUsers } from "@/queries/index"
import { checkEnv } from "@/utils/services-fetching"

const useGithubUsers = () => {
  const [token] = useToken()

  const { data, error } = useSWR(
    token ? [getGitHubUsers, token] : null,
    fetcher
  )

  console.log("useGithubUsers:", data, error)

  return Array.isArray(data) ? data : data?.services[0].github
}

export const GithubUsersLoader = () => {
  const users = useGithubUsers()

  if (!users) return <Loader />
  if (!users.length) return <div>Aucun utilisateur pour le moment...</div>

  return <Users users={users} />
}

export const reqIsGithub = (req: NextApiRequest) => {
  checkEnv(["GITHUB_WEBHOOK_SECRET"])
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
