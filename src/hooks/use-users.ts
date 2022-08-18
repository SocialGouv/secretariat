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
  revoke as revokeQuery,
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

export const mutateUser = (user: User): Promise<User | undefined> => {
  const { id, arrival, departure } = user
  return graphQLFetcher(updateUser, "include", {
    id,
    _set: { arrival, departure },
  })
}

export const mergeUsers = async (
  userToKeep: User,
  userToDrop: User
): Promise<User> => {
  await graphQLFetcher(mergeUsersQuery, "include", {
    userToKeepId: userToKeep.id,
    userToDropId: userToDrop.id,
  })

  return mapUser({
    ...userToKeep,
    services: userToKeep.services.concat(userToDrop.services),
  })
}

export const detachUserServiceAccount = async (account: ServiceAccount) => {
  const {
    insert_users_one: { id: userId },
  } = await graphQLFetcher(insertUser, "include")

  await graphQLFetcher(updateService, "include", {
    serviceId: account.id,
    service: { user_id: userId },
  })
}

export const revokeAccount = async (account: ServiceAccount) => {
  let accountServiceID =
    account.type === "ovh"
      ? account.data.primaryEmailAddress
      : account.type === "github" || account.type === "matomo"
      ? account.data.login
      : account.data.id

  const {
    revoke: { status, body },
  } = await graphQLFetcher(revokeQuery, "include", {
    serviceName: account.type,
    accountID: account.id,
    accountServiceID,
  })

  return { status, body }
}

const useUsers = () => {
  const getMappedUsers = async () => {
    const data = await graphQLFetcher(getUsers, "include")
    return mapUsers(data.users)
  }

  const { data: users } = useSWR("/users", getMappedUsers)

  return users
}

export default useUsers
