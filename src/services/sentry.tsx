import useSWR from "swr"

import fetcher from "@/utils/fetcher"
import useToken from "@/services/token"
import Users from "@/components/sentry-users"
import Loader from "@/components/common/loader"
import { getSentryUsers } from "@/queries/index"

const useSentryUsers = () => {
  const [token] = useToken()

  const { data, error } = useSWR(
    token ? [getSentryUsers, token] : null,
    fetcher
  )

  console.log("useGithubUsers:", data, error)

  return Array.isArray(data) ? data : data?.services[0].sentry
}

export const SentryUsersLoader = () => {
  const users = useSentryUsers()

  if (!users) return <Loader />
  if (!users.length) return <div>Aucun utilisateur pour le moment...</div>

  return <Users users={users} />
}
