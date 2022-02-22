import useSWR from "swr"

import fetcher from "@/utils/fetcher"
import useToken from "@/services/token"
import { getServicesCount } from "@/queries/index"

const useServicesCount = () => {
  const [token] = useToken()

  const { data, error } = useSWR(
    token ? [getServicesCount, token] : null,
    fetcher
  )

  return Array.isArray(data) ? data : data?.services_count[0]
}

export default useServicesCount
