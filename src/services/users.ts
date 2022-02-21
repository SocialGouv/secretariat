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

const mapServiceData: Middleware = (useSWRNext) => {
  return (key, fetcher, config) => {
    const swr = useSWRNext(key, fetcher, config)

    if (swr.data) {
      swr.data.users.forEach((user: User, i: number) => {
        const { matomo, mattermost, sentry, zammad, nextcloud, github, ovh } =
          user
        const data = mattermost
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
        swr.data.users[i] = { ...data, ...user }
      })
    }

    return swr
  }
}

const useUsers = () => {
  const [token] = useToken()
  // const { query } = useSearch()

  const { data } = useSWR(token ? [getUsers, token] : null, fetcher, {
    use: [mapServiceData],
  })

  if (!data) return

  const users = Array.isArray(data) ? data : data?.users

  // if (query?.length) {
  //   const regex = new RegExp(query, "g")
  //   return users.filter((user: User) => {
  //     if (user.email.match(regex) || user.name?.match(regex)) {
  //       return true
  //     }
  //   })
  // }

  return users
}

export const useFilteredUsers = () => {
  const users = useUsers()
  const { query } = useSearch()

  const { data } = useSWR(users ? `users/search/${query}` : null, () => {
    if (query?.length) {
      const regex = new RegExp(query, "g")
      return users.filter((user: User) => {
        if (user.email.match(regex) || user.name?.match(regex)) {
          return true
        }
      })
    }
    return users
  })

  console.log("useFilteredUsers", data, query)

  return { users: data, query }
}

export const usePaging = () => {
  const { data, mutate } = useSWR("paging", null, { fallbackData: 1 })
  console.log("usePaging", data)
  return { page: data, mutate }
}

export const usePagedUsers = () => {
  const { page } = usePaging()
  const { users, query } = useFilteredUsers()
  const { data } = useSWR(
    users ? `users/search/${query}/page/${page}` : null,
    () => {
      console.log("EXEC PAGING")

      // return Promise.resolve(users.slice(0, (page || 1) * 20))
      return users.slice(0, (page || 1) * 20)
    }
  )
  console.log("usePagedUsers", data, users?.length)
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
