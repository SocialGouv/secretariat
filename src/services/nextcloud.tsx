import useSWR from "swr"

import fetcher from "@/utils/fetcher"
import useToken from "@/services/token"
import Loader from "@/components/common/loader"
import NextCloudUsers from "@/components/nextcloud-users"
import { getNextCloudUsers } from "@/queries/index"

const useNextCloudUsers = () => {
  const [token] = useToken()

  const { data, error } = useSWR(
    token ? [getNextCloudUsers, token] : null,
    fetcher
  )

  console.log("useNextCloudUsers:", data, error)

  return Array.isArray(data) ? data : data?.services[0].nextcloud
}

export const NextCloudUsersLoader = () => {
  const users = useNextCloudUsers()

  if (!users) return <Loader />
  if (!users.length) return <div>Aucun utilisateur pour le moment...</div>

  return <NextCloudUsers users={users} />
}
