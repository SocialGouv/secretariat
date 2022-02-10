import useSWR from "swr"

import fetcher from "@/utils/fetcher"
import useToken from "@/services/token"
import { getMattermostUsers } from "@/queries/index"

const useMattermostUsers = () => {
  const [token] = useToken()

  const { data, error } = useSWR(
    token ? [getMattermostUsers, token] : null,
    fetcher
  )

  console.log("useMattermostUsers:", data, error)

  return Array.isArray(data) ? data : data?.services[0].mattermost
}

export default useMattermostUsers
