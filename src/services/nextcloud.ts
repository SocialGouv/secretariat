import useSWR from "swr"

import fetcher from "@/utils/fetcher"
import useToken from "@/services/token"
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

export default useNextCloudUsers
