import useSWR from "swr"
import { request, gql } from "graphql-request"

import fetcher from "@/utils/fetcher"
import Users from "@/components/github-users"
import Loader from "@/components/common/loader"

import crypto from "crypto"
import type { NextApiRequest } from "next"

const getGitHubUsersQuery = gql`
  query getGithubUsers {
    services {
      github
    }
  }
`

export const getGitHubUsers = async () => {
  const data = await fetcher(getGitHubUsersQuery)

  return data
}

const useGithubUsers = () => {
  const { data, error, isValidating } = useSWR("github", () =>
    fetcher(getGitHubUsersQuery)
  )
  console.log("DATA GITHUB", data)

  return Array.isArray(data) ? data : data?.services[0].github.members
}

export const GithubUsersLoader = () => {
  const users = useGithubUsers()

  if (!users) return <Loader />
  if (!users.length) return <div>Aucun utilisateur pour le moment...</div>

  return <Users users={users} />
}

export const reqIsGithub = (req: NextApiRequest) => {
  const payload = JSON.stringify(req.body)
  const sig = req.headers["x-hub-signature"] || ""
  const hmac = crypto.createHmac(
    "sha1",
    process.env.GITHUB_WEBHOOK_SECRET ?? "undefined"
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
