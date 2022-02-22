import useSWR from "swr"

import fetcher from "@/utils/fetcher"
import useToken from "@/services/token"
import useSearch from "@/services/search"
import { getUsers } from "@/queries/index"

const getMattermostData = ({
  email,
  username,
  last_name,
  first_name,
}: MattermostUser): { email: string; name: string } => ({
  email,
  name: first_name ? `${first_name} ${last_name}` : username,
})

const getSentryData = ({
  name,
  email,
  user: { avatarUrl },
}: SentryUser): { email: string; name: string; avatarUrl: string } => ({
  email,
  name,
  avatarUrl,
})

const getZammadData = ({
  email,
  lastname,
  firstname,
}: ZammadUser): { email: string; name: string } => ({
  email,
  name: `${firstname} ${lastname}`,
})

const getNextCloudData = ({
  email,
  displayname,
}: NextCloudUser): { email: string; name: string } => ({
  email: email ?? "",
  name: displayname,
})

const getGithubData = ({
  name,
  login,
  email,
  avatarUrl,
}: GithubUser): { email: string; name: string; avatarUrl: string } => ({
  email,
  avatarUrl,
  name: name ?? login,
})

const getOVHData = ({
  displayName,
  primaryEmailAddress,
}: OVHUser): { email: string; name: string } => ({
  name: displayName,
  email: primaryEmailAddress,
})

const getMatomoData = ({
  login,
  email,
}: MatomoUser): { email: string; name: string } => ({
  email,
  name: login,
})

const mapUsers = (users: User[]): User[] => {
  return users.map((user) => {
    const { matomo, mattermost, sentry, zammad, nextcloud, github, ovh } = user
    const serviceData = mattermost
      ? getMattermostData(mattermost)
      : sentry
      ? getSentryData(sentry)
      : zammad
      ? getZammadData(zammad)
      : matomo
      ? getMatomoData(matomo)
      : nextcloud
      ? getNextCloudData(nextcloud)
      : github
      ? getGithubData(github)
      : ovh
      ? getOVHData(ovh)
      : {}
    return { ...serviceData, ...user }
  })
}

const useUsers = () => {
  const [token] = useToken()

  const getMappedUsers = async (query: string, token: string) => {
    const data = await fetcher(query, token)
    return Promise.resolve(mapUsers(data.users))
  }

  const { data } = useSWR(token ? [getUsers, token] : null, getMappedUsers, {
    use: [],
  })

  return data
}

export const useFilteredUsers = () => {
  const users = useUsers()
  const { query } = useSearch()

  const { data } = useSWR(users ? `users/search/${query}` : null, () => {
    if (users && query?.length) {
      const regex = new RegExp(query, "g")
      return users.filter((user: User) => {
        if (user.email?.match(regex) || user.name?.match(regex)) {
          return true
        }
      })
    }
    return users
  })

  return { users: data, query }
}

export const usePaging = () => {
  const { data, mutate } = useSWR("paging", null, { fallbackData: 1 })
  return { page: data, setPage: mutate }
}

export const usePagedUsers = () => {
  const { page } = usePaging()
  const { users, query } = useFilteredUsers()
  const { data } = useSWR(
    users ? `users/search/${query}/page/${page}` : null,
    () => {
      return users && users.slice(0, (page || 1) * 20)
    }
  )
  return data
}

export default useUsers
