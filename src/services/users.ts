import useSWR from "swr"

import fetcher from "@/utils/fetcher"
import useToken from "@/services/token"
import { getUsers } from "@/queries/index"

const useUsers = () => {
  const [token] = useToken()

  const { data, error } = useSWR(token ? [getUsers, token] : null, fetcher)

  console.log("useUsers:", data, error, token)

  return Array.isArray(data) ? data : data?.users
  // return data.users
}

export default useUsers
