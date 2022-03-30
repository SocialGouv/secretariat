import useSWR from "swr"

import fetcher from "@/utils/fetcher"
import SERVICES from "@/utils/SERVICES"
import useToken from "@/hooks/use-token"
import { detectWarnings } from "@/utils/detect-warnings"
import { deleteUser, getUserById, getUsers2, updateUser } from "@/queries/index"

const DEFAULT_AVATAR_URL = "/images/user-avatar.svg"
interface UserMapping {
  email: string
  name: string
  avatarUrl?: string
}

// const getMattermostData = ({
//   email,
//   username,
//   last_name,
//   first_name,
// }: MattermostUser): UserMapping => ({
//   email,
//   name: first_name ? `${first_name} ${last_name}` : username,
// })

// const getSentryData = ({
//   name,
//   email,
//   user: { avatarUrl },
// }: SentryServiceAccount): UserMapping => ({
//   email,
//   name,
//   avatarUrl,
// })

// const getZammadData = ({
//   email,
//   lastname,
//   firstname,
// }: ZammadUser): UserMapping => ({
//   email,
//   name: `${firstname} ${lastname}`,
// })

// const getNextCloudData = ({
//   email,
//   displayname,
// }: NextCloudUser): UserMapping => ({
//   email: email ?? "",
//   name: displayname,
// })

// const getGithubData = ({
//   name,
//   login,
//   email,
//   avatarUrl,
// }: GithubUser): UserMapping => ({
//   email,
//   avatarUrl,
//   name: name ?? login,
// })

// const getOVHData = ({
//   displayName,
//   primaryEmailAddress,
// }: OVHUser): UserMapping => ({
//   name: displayName,
//   email: primaryEmailAddress,
// })

// const getMatomoData = ({ login, email }: MatomoUser): UserMapping => ({
//   email,
//   name: login,
// })

// const getDataFrom: Record<ServiceName, (...args: any[]) => UserMapping> = {
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
  return DEFAULT_AVATAR_URL
}

const mapUsers = (users: User[]): User[] => {
  return users
    .map((user) => {
      const { services } = user
      const data = getDataFromServiceAccounts(services)

      if (!data.avatarUrl) {
        data.avatarUrl = getAvatarUrl(services)
      }

      user.warning = detectWarnings(user)

      return { ...data, ...user }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

export const haveSimilarServices = (a: User, b: User) => {
  const servicesA = a.services.map((service) => service.type)
  const servicesB = b.services.map((service) => service.type)
  return servicesA.filter((value) => servicesB.includes(value)).length
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
    const data = await fetcher(getUsers2, token)
    console.log("MAIN", data)
    const mappedUsers = mapUsers(data.users2)
    console.log({ mappedUsers })

    return Promise.resolve(mappedUsers)
  }

  const { data: users } = useSWR(token ? "/users" : null, getMappedUsers)

  return users
}

export default useUsers
