import useSWR from "swr"

import fetcher from "@/utils/fetcher"
import SERVICES from "@/utils/SERVICES"
import useToken from "@/hooks/use-token"
import { detectWarnings } from "@/utils/detect-warnings"
import {
  getUsers,
  updateUser,
  mergeUsers as mergeUsersQuery,
} from "@/queries/index"

interface UserMapping {
  email: string
  name: string
  avatarUrl?: string
}

type getDataFromType = {
  [SN in ServiceName]: (
    serviceAccount: ServiceAccountsMapping[SN]
  ) => UserMapping
}

const getDataFrom: getDataFromType = {
  matomo: ({ data: { login, email } }) => ({
    email,
    name: login,
  }),
  ovh: ({ data: { displayName, primaryEmailAddress } }) => ({
    name: displayName,
    email: primaryEmailAddress,
  }),
  github: ({ data: { name, login, email, avatarUrl } }) => ({
    email,
    avatarUrl,
    name: name ?? login,
  }),
  nextcloud: ({ data: { email, displayname } }) => ({
    email: email ?? "",
    name: displayname,
  }),
  zammad: ({ data: { email, lastname, firstname } }) => ({
    email,
    name: `${firstname} ${lastname}`,
  }),
  sentry: ({
    data: {
      name,
      email,
      user: { avatarUrl },
    },
  }) => ({
    email,
    name,
    avatarUrl,
  }),
  mattermost: ({ data: { email, username, last_name, first_name } }) => ({
    email,
    name: first_name ? `${first_name} ${last_name}` : username,
  }),
}

const getDataFromServiceAccounts = (services: ServiceAccount[]) => {
  for (const SERVICE of SERVICES) {
    for (const serviceAccount of services) {
      if (serviceAccount.type === SERVICE) {
        return getDataFrom[serviceAccount.type](serviceAccount as never)
      }
    }
  }
  return {} as UserMapping
}

const getAvatarUrl = (services: ServiceAccount[]) => {
  const githubAccount = services.find(
    ({ type }) => type === "github"
  ) as GithubServiceAccount
  if (githubAccount) return githubAccount.data.avatarUrl
  const sentryAccount = services.find(
    ({ type }) => type === "github"
  ) as SentryServiceAccount
  if (sentryAccount) return sentryAccount.data.user.avatarUrl
  return undefined
}

export const mapUser = (user: User): User => {
  const { services } = user
  const data = getDataFromServiceAccounts(services)

  if (!data.avatarUrl) {
    data.avatarUrl = getAvatarUrl(services)
  }

  user.warnings = detectWarnings(user)

  return { ...user, ...data }
}

const mapUsers = (users: User[]): User[] => {
  return users
    .map((user) => mapUser(user))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export const mutateUser = async (
  user: User,
  token: string
): Promise<User | undefined> => {
  const { id, arrival, departure } = user
  return await fetcher(updateUser, token, { id, _set: { arrival, departure } })
}

export const mergeUsers = async (
  userToKeep: User,
  userToDrop: User,
  token: string
): Promise<User> => {
  await fetcher(mergeUsersQuery, token, {
    userToKeepId: userToKeep.id,
    userToDropId: userToDrop.id,
  })

  return mapUser({
    ...userToKeep,
    services: userToKeep.services.concat(userToDrop.services),
  })
}

const useUsers = () => {
  const [token] = useToken()
  console.log("TOKEN", token)

  const getMappedUsers = async () => {
    const data = await fetcher(getUsers, token)
    return Promise.resolve(mapUsers(data.users))
  }

  const { data: users } = useSWR(token ? "/users" : null, getMappedUsers)

  return users
}

export default useUsers
