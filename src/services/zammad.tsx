import useSWR from "swr"

import fetcher from "@/utils/fetcher"
import useToken from "@/services/token"
import Loader from "@/components/common/loader"
import ZammadUsers from "@/components/zammad-users"
import { getZammadUsers } from "@/queries/index"

const useZammadUsers = () => {
  const [token] = useToken()

  const { data, error } = useSWR(
    token ? [getZammadUsers, token] : null,
    fetcher
  )

  console.log("useZammadUsers:", data, error)

  return Array.isArray(data) ? data : data?.services[0].zammad
}

export const ZammadUsersLoader = () => {
  const users = useZammadUsers()

  if (!users) return <Loader />
  if (!users.length) return <div>Aucun utilisateur pour le moment...</div>

  return <ZammadUsers users={users} />
}
