import useSWR from "swr"

import fetcher from "@/utils/fetcher"
import useToken from "@/services/token"
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

export default useZammadUsers
