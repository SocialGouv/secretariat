import Loader from "@/components/common/loader"
import Users from "@/components/github-users"
import { getGitHubUsers } from "@/queries/index"
import useToken from "@/services/token"
import fetcher from "@/utils/fetcher"
import useSWR from "swr"

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
  console.log("GithubUsersLoader", users)

  if (!users) return <Loader />
  if (!users.length) return <div>Aucun utilisateur pour le moment...</div>

  return <Users users={users} />
}
