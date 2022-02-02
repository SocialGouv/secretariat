import useSWR from "swr"

import fetcher from "@/utils/fetcher"
import useToken from "@/services/token"
import Loader from "@/components/common/loader"
import MatomoUsers from "@/components/matomo-users"
import { getMatomoUsers } from "@/queries/index"

const useMatomoUsers = () => {
  const [token] = useToken()

  const { data, error } = useSWR(
    token ? [getMatomoUsers, token] : null,
    fetcher
  )

  console.log("useMatomoUsers:", data, error)

  return Array.isArray(data) ? data : data?.services[0].matomo
}

export const MatomoUsersLoader = () => {
  const users = useMatomoUsers()

  if (!users) return <Loader />
  if (!users.length) return <div>Aucun utilisateur pour le moment...</div>

  return <MatomoUsers users={users} />
}
