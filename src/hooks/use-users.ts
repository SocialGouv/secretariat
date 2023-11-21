import useSWR from "swr"

import graphQLFetcher from "@/utils/graphql-fetcher"
import SERVICES from "@/utils/SERVICES"
import { detectWarnings } from "@/utils/detect-warnings"
import {
  getUsers,
  updateUser,
  insertUser,
  updateService,
  mergeUsers as mergeUsersQuery,
  disableAction,
  enableAction,
} from "@/queries/index"
import logAction from "@/utils/log-action"
import { getSession } from "next-auth/react"

interface UserMapping {
  // email: string
  name: string
  avatarUrl?: string
}

type getDataFromType = {
  [SN in ServiceName]: (
    serviceAccount: ServiceAccountsMapping[SN]
  ) => UserMapping
}

const getDataFrom: getDataFromType = {
  matomo: ({ data: { login } }) => ({
    name: login,
  }),
  ovh: ({ data: { displayName } }) => ({
    name: displayName,
  }),
  github: ({ data: { name, login, avatarUrl } }) => ({
    avatarUrl,
    name: name ?? login,
  }),
  nextcloud: ({ data: { displayname } }) => ({
    name: displayname,
  }),
  zammad: ({ data: { lastname, firstname } }) => ({
    name: `${firstname} ${lastname}`,
  }),
  sentry: ({
    data: {
      name,
      user: { avatarUrl },
    },
  }) => ({
    name,
    avatarUrl,
  }),
  mattermost: ({ data: { username, last_name, first_name } }) => ({
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

export const mutateUser = (user: User): Promise<User | undefined> => {
  const { id, arrival, departure } = user
  return graphQLFetcher({
    query: updateUser,
    includeCookie: true,
    parameters: {
      id,
      _set: { arrival, departure },
    },
  })
}

export const mergeUsers = async (
  userToKeep: User,
  userToDrop: User
): Promise<User> => {
  const session = await getSession()
  logAction({
    action: "merge",
    user: session?.user.login,
    parameters: JSON.stringify({ userToKeep, userToDrop }),
  })

  await graphQLFetcher({
    query: mergeUsersQuery,
    includeCookie: true,
    parameters: {
      userToKeepId: userToKeep.id,
      userToDropId: userToDrop.id,
    },
  })

  return mapUser({
    ...userToKeep,
    services: userToKeep.services.concat(userToDrop.services),
  })
}

export const detachUserServiceAccount = async (account: ServiceAccount) => {
  const {
    insert_users_one: { id: userId },
  } = await graphQLFetcher({ query: insertUser, includeCookie: true })

  await graphQLFetcher({
    query: updateService,
    includeCookie: true,
    parameters: {
      serviceId: account.id,
      service: { user_id: userId },
    },
  })
}

export const disableAccount = async (account: ServiceAccount) => {
  const {
    disableAction: { status, body },
  } = await graphQLFetcher({
    query: disableAction,
    includeCookie: true,
    parameters: {
      serviceAccountId: account.id,
    },
  })

  return { status, body }
}

export const enableAccount = async (account: ServiceAccount) => {
  const {
    enableAction: { status, body },
  } = await graphQLFetcher({
    query: enableAction,
    includeCookie: true,
    parameters: {
      serviceAccountId: account.id,
    },
  })

  return { status, body }
}

const useUsers = () => {
  const getMappedUsers = async () => {
    const data = await graphQLFetcher({ query: getUsers, includeCookie: true })
    return mapUsers(data.users)
  }

  const { data: users } = useSWR("/users", getMappedUsers)

  return users
}

export default useUsers
