import useSWR from "swr"

import fetcher from "@/utils/fetcher"
import useToken from "@/services/token"
import Loader from "@/components/common/loader"
import OVHUsers from "@/components/ovh-users"
import { getOVHUsers } from "@/queries/index"

const useOVHUsers = () => {
  const [token] = useToken()

  const { data, error } = useSWR(token ? [getOVHUsers, token] : null, fetcher)

  console.log("useOVHUsers:", data, error)

  return Array.isArray(data) ? data : data?.services[0].ovh
}

export const OVHUsersLoader = () => {
  const users = useOVHUsers()

  if (!users) return <Loader />
  if (!users.length) return <div>Aucun utilisateur pour le moment...</div>

  return <OVHUsers users={users} />
}
