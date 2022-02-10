import useSWR from "swr"

import fetcher from "@/utils/fetcher"
import useToken from "@/services/token"
import { getOVHUsers } from "@/queries/index"

const useOVHUsers = () => {
  const [token] = useToken()

  const { data, error } = useSWR(token ? [getOVHUsers, token] : null, fetcher)

  console.log("useOVHUsers:", data, error)

  return Array.isArray(data) ? data : data?.services[0].ovh
}

export default useOVHUsers
