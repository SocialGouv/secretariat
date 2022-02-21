import useSWR from "swr"

import fetcher from "@/utils/fetcher"
import useToken from "@/services/token"
import { getGitHubUsers } from "@/queries/index"

const useGithubUsers = () => {
  const [token] = useToken()

  const { data, error } = useSWR(
    token ? [getGitHubUsers, token] : null,
    fetcher
  )

  console.log("useGithubUsers:", data, error)

  return Array.isArray(data) ? data : data?.services[0].github
}

export default useGithubUsers
