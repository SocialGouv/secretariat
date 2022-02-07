import useSWR from "swr"

import fetcher from "@/utils/fetcher"
import useToken from "@/services/token"
import Loader from "@/components/common/loader"
import MattermostUsers from "@/components/mattermost-users"
import { getMattermostUsers } from "@/queries/index"

const useMattermostUsers = () => {
  const [token] = useToken()

  const { data, error } = useSWR(
    token ? [getMattermostUsers, token] : null,
    fetcher
  )

  console.log("useMattermostUsers:", data, error)

  return Array.isArray(data) ? data : data?.services[0].mattermost
}

export const MattermostUsersLoader = () => {
  const users = useMattermostUsers()

  if (!users) return <Loader />
  if (!users.length) return <div>Aucun utilisateur pour le moment...</div>

  return <MattermostUsers users={users} />
}
