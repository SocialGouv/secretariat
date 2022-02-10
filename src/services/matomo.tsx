import useSWR from "swr"

import fetcher from "@/utils/fetcher"
import useToken from "@/services/token"
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

export default useMatomoUsers
