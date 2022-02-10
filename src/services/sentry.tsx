import useSWR from "swr"

import fetcher from "@/utils/fetcher"
import useToken from "@/services/token"
import { getSentryUsers } from "@/queries/index"

const useSentryUsers = () => {
  const [token] = useToken()

  const { data, error } = useSWR(
    token ? [getSentryUsers, token] : null,
    fetcher
  )

  console.log("useSentryUsers:", data, error)

  return Array.isArray(data) ? data : data?.services[0].sentry
}

export default useSentryUsers
