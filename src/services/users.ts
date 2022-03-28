import useSWR from "swr"

import fetcher from "@/utils/fetcher"
import useToken from "@/services/token"
import useSearch from "@/services/search"
import useFilters from "@/services/filters"
import { deleteUser, getUserById, getUsers, updateUser } from "@/queries/index"

interface UserMapping {
  email: string
  name: string
  avatarUrl?: string
}

const getMattermostData = ({
  email,
  username,
  last_name,
  first_name,
}: MattermostUser): UserMapping => ({
  email,
  name: first_name ? `${first_name} ${last_name}` : username,
})

const getSentryData = ({
  name,
  email,
  user: { avatarUrl },
}: SentryUser): UserMapping => ({
  email,
  name,
  avatarUrl,
})

const getZammadData = ({
  email,
  lastname,
  firstname,
}: ZammadUser): UserMapping => ({
  email,
  name: `${firstname} ${lastname}`,
})

const getNextCloudData = ({
  email,
  displayname,
}: NextCloudUser): UserMapping => ({
  email: email ?? "",
  name: displayname,
})

const getGithubData = ({
  name,
  login,
  email,
  avatarUrl,
}: GithubUser): UserMapping => ({
  email,
  avatarUrl,
  name: name ?? login,
})

const getOVHData = ({
  displayName,
  primaryEmailAddress,
}: OVHUser): UserMapping => ({
  name: displayName,
  email: primaryEmailAddress,
})

const getMatomoData = ({ login, email }: MatomoUser): UserMapping => ({
  email,
  name: login,
})

const mapUsers = (users: User[]): User[] => {
  return users
    .map((user) => {
      const { matomo, mattermost, sentry, zammad, nextcloud, github, ovh } =
        user
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
        : ({} as UserMapping)

      if (!serviceData.avatarUrl) {
        if (github) serviceData.avatarUrl = github.avatarUrl
        else if (sentry) serviceData.avatarUrl = sentry.user.avatarUrl
      }
      return { ...serviceData, ...user }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

export const haveSimilarServices = (a: User, b: User) => {
  return (
    (a.matomo && b.matomo) ||
    (a.mattermost && b.mattermost) ||
    (a.github && b.github) ||
    (a.zammad && b.zammad) ||
    (a.nextcloud && b.nextcloud) ||
    (a.ovh && b.ovh) ||
    (a.sentry && b.sentry)
  )
}

export const mergeUsers = async (
  { id: idToKeep }: User,
  { id: idToDrop }: User,
  token: string
): Promise<User | undefined> => {
  const {
    users: [userToKeep],
  } = await fetcher(getUserById, token, { id: idToKeep })
  const {
    users: [userToDrop],
  } = await fetcher(getUserById, token, { id: idToDrop })

  if (
    userToKeep &&
    userToDrop &&
    !haveSimilarServices(userToKeep, userToDrop)
  ) {
    Object.keys(userToKeep).forEach(
      (key) => userToKeep[key] === null && delete userToKeep[key]
    )
    const user = { ...userToDrop, ...userToKeep }
    const { id, ..._set } = user
    await fetcher(updateUser, token, { id, _set })
    await fetcher(deleteUser, token, { id: userToDrop.id })
    return user
  }

  return undefined
}

const useUsers = () => {
  const [token] = useToken()

  const getMappedUsers = async () => {
    const data = await fetcher(getUsers, token)
    return Promise.resolve(mapUsers(data.users))
  }

  const { data } = useSWR(token ? "/users" : null, getMappedUsers)

  return data
}

export const useFilteredUsers = () => {
  const users = useUsers()
  const { query } = useSearch()
  const { filters } = useFilters()

  const matchSearchQuery = (user: User, regex: RegExp): boolean => {
    const { id, ...data } = user
    const values = Object.values(data)
    return !!values
      .filter((value) => value && typeof value === "string")
      .concat(
        values
          .filter((value) => value && typeof value === "object")
          .reduce(
            (arr, obj) =>
              arr.concat(
                Object.values(obj).filter(
                  (value) => value && typeof value === "string"
                )
              ),
            []
          )
      )
      .join(" ")
      .match(regex)
  }

  const matchServices = (user: User): boolean => {
    if (filters?.services) {
      for (const [key, value] of Object.entries(filters.services)) {
        if (value && user[key as keyof User]) {
          return true
        }
      }
    }
    return false
  }

  const matchAlerts = (user: User): boolean => {
    if (filters?.alerts) {
      return !!user.warning?.length
    }
    return true
  }

  const matchExpiry = (user: User): boolean => {
    if (filters?.expiry && user.departure) {
      return new Date(user.departure).getTime() < filters.expiry.getTime()
    }
    return true
  }

  const { data } = useSWR(
    users && filters
      ? `/users/filters/${JSON.stringify(filters)}/search/${query}`
      : null,
    () => {
      if (users) {
        const regex = new RegExp(query || "", "gi")
        return users.filter(
          (user: User) =>
            matchServices(user) &&
            matchSearchQuery(user, regex) &&
            matchAlerts(user) &&
            matchExpiry(user)
        )
      }
      return users
    }
  )

  return { users: data, query, filters }
}

export const usePaging = () => {
  const pageSize = 20
  const { data, mutate } = useSWR("paging", null, { fallbackData: 1 })

  return { page: data, setPage: mutate, pageSize }
}

export const usePagedUsers = () => {
  const { page, pageSize } = usePaging()
  const { users, query, filters } = useFilteredUsers()

  const { data } = useSWR(
    users
      ? `/users/filters/${JSON.stringify(filters)}/search/${query}/page/${page}`
      : null,
    () => {
      return users && users.slice(0, (page || 1) * pageSize)
    }
  )
  return data
}

export default useUsers
