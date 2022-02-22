import useSWR from "swr"
import useSWRImmutable from "swr/immutable"
import type { Middleware, SWRHook } from "swr"

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

// const mapServiceData: Middleware = (useSWRNext) => {
//   return (key, fetcher, config) => {
//     const swr = useSWRNext(key, fetcher, config)

//     // const mapServices = async () => {
//     //   const data = await fetcher(key)
//     // }

//     if (swr.data) {
//       const { data } = swr
//       const { users } = data as Record<"users", User[]>
//       users.forEach((user: User, i: number) => {
//         const { matomo, mattermost, sentry, zammad, nextcloud, github, ovh } =
//           user
//         const serviceData = mattermost
//           ? getMattermostData(mattermost)
//           : sentry
//           ? getSentryData(sentry)
//           : zammad
//           ? getZammadData(zammad)
//           : matomo
//           ? getMatomoData(matomo)
//           : nextcloud
//           ? getNextCloudData(nextcloud)
//           : github
//           ? getGithubData(github)
//           : ovh
//           ? getOVHData(ovh)
//           : {}
//         users[i] = { ...serviceData, ...user }
//       })
//     }

//     return swr
//   }
// }

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
  // const { query } = useSearch()

  const getMappedUsers = async (query: string, token: string) => {
    const data = await fetcher(query, token)
    return Promise.resolve(mapUsers(data.users))
  }

  const { data } = useSWR(token ? [getUsers, token] : null, getMappedUsers, {
    use: [],
  })

  // if (!data) return

  // const users = Array.isArray(data) ? data : data?.users

  // if (query?.length) {
  //   const regex = new RegExp(query, "g")
  //   return users.filter((user: User) => {
  //     if (user.email.match(regex) || user.name?.match(regex)) {
  //       return true
  //     }
  //   })
  // }

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
  return { page: data, mutate }
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

// const useUsers = () => {
//   const [token] = useToken()
//   // const { query } = useSearch()

//   const { data, error } = useSWR(token ? [getUsers, token] : null, fetcher)

//   if (!data) return

//   const users = (Array.isArray(data) ? data : data?.users).map((user: User) => {
//     if (user.email && user.email.length) {
//       console.log("!!!! EXIT !!!!")
//       return user
//     }

//     const { matomo, mattermost, sentry, zammad, nextcloud, github, ovh } = user

//     // if (mattermost) {
//     //   return { ...getMattermostData(mattermost), ...user }
//     // } else if (sentry) {
//     //   return { ...getSentryData(sentry), ...user }
//     // } else if (zammad) {
//     //   return { ...getZammadData(zammad), ...user }
//     // } else if (matomo) {
//     //   return { ...getMatomoData(matomo), ...user }
//     // } else if (nextcloud) {
//     //   return { ...getNextCloudData(nextcloud), ...user }
//     // } else if (github) {
//     //   return { ...getGithubData(github), ...user }
//     // } else if (ovh) {
//     //   return { ...getOVHData(ovh), ...user }
//     // }

//     return user
//   })

//   // if (query?.length) {
//   //   const regex = new RegExp(query, "g")
//   //   return users.filter((user: User) => {
//   //     if (
//   //       user.github &&
//   //       (user.github.email.match(regex) || user.github.login.match(regex))
//   //     ) {
//   //       return true
//   //     }
//   //     if (
//   //       user.sentry &&
//   //       (user.sentry.email.match(regex) || user.sentry.name.match(regex))
//   //     ) {
//   //       return true
//   //     }
//   //     if (
//   //       user.matomo &&
//   //       (user.matomo.email.match(regex) || user.matomo.login.match(regex))
//   //     ) {
//   //       return true
//   //     }
//   //     if (
//   //       user.nextcloud &&
//   //       (user.nextcloud.email?.match(regex) ||
//   //         user.nextcloud.displayname.match(regex))
//   //     ) {
//   //       return true
//   //     }
//   //     if (
//   //       user.mattermost &&
//   //       (user.mattermost.email.match(regex) ||
//   //         user.mattermost.username.match(regex) ||
//   //         user.mattermost.first_name.match(regex) ||
//   //         user.mattermost.last_name.match(regex))
//   //     ) {
//   //       return true
//   //     }
//   //     if (
//   //       user.ovh &&
//   //       (user.ovh.displayName.match(regex) ||
//   //         user.ovh.firstName.match(regex) ||
//   //         user.ovh.lastName.match(regex) ||
//   //         user.ovh.primaryEmailAddress.match(regex))
//   //     ) {
//   //       return true
//   //     }
//   //     if (
//   //       user.zammad &&
//   //       (user.zammad.firstname.match(regex) ||
//   //         user.zammad.lastname.match(regex) ||
//   //         user.zammad.login.match(regex) ||
//   //         user.zammad.email.match(regex))
//   //     ) {
//   //       return true
//   //     }
//   //   })
//   // }

//   return users
// }

export default useUsers
