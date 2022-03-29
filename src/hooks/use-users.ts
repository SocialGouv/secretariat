import useSWR from "swr"

import fetcher from "@/utils/fetcher"
import useToken from "@/hooks/use-token"
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

export const mutateUser = async (
  user: User,
  token: string
): Promise<User | undefined> => {
  const { id, avatarUrl, email, name, warning, updated_at, ...data } = user
  return await fetcher(updateUser, token, { id, _set: data })
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
    const { id, updated_at, warning, ..._set } = user
    await fetcher(updateUser, token, { id, _set })
    await fetcher(deleteUser, token, { id: userToDrop.id })
    return mapUsers([user])[0]
  }

  return undefined
}

const useUsers = () => {
  const [token] = useToken()

  const getMappedUsers = async () => {
    const data = await fetcher(getUsers, token)
    return Promise.resolve(mapUsers(data.users))
  }

  const { data: users } = useSWR(token ? "/users" : null, getMappedUsers)

  return users
}

export default useUsers
