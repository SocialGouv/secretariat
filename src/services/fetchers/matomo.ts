import { randomUUID } from "crypto"
import { setTimeout } from "timers/promises"

import fetcher from "@/utils/rest-fetcher"
import { MATOMO_API_TOKEN } from "@/utils/env"

const PAGE_SIZE = 100 // maximum for Matomo's API

const formatUser = (user: Record<string, unknown>) => ({
  ...user,
  id: randomUUID(),
})

const fetchSitesNames = async (
  msDelay: number,
  users: { sites: Record<string, unknown>[] }[],
  sites: Record<string, unknown>[] = [],
  page = 0
): Promise<Record<string, unknown>[]> => {
  await setTimeout(msDelay)
  const response = await fetcher(
    "https://matomo.fabrique.social.gouv.fr/index.php",
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: `module=API&method=SitesManager.getAllSites&filter_limit=${PAGE_SIZE}&filter_offset=${
        PAGE_SIZE * page
      }&format=json&token_auth=${MATOMO_API_TOKEN}`,
    }
  )
  const sitesPage = response ? await response.json() : []

  if (sitesPage.length === 0) {
    return users.map((user) => ({
      ...user,
      sites: user.sites.map((userSite) => ({
        ...userSite,
        ...sites.find((site) => site.idsite === userSite.site),
      })),
    }))
  } else {
    return fetchSitesNames(msDelay, users, [...sites, ...sitesPage], page + 1)
  }
}

const fetchUserSites = async (
  msDelay: number,
  user: Record<string, unknown>,
  sites: Record<string, unknown>[] = [],
  page = 0
): Promise<Record<string, unknown>[]> => {
  await setTimeout(msDelay)
  const response = await fetcher(
    "https://matomo.fabrique.social.gouv.fr/index.php",
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: `module=API&method=UsersManager.getSitesAccessFromUser&userLogin=${
        user.login
      }&filter_limit=${PAGE_SIZE}&filter_offset=${
        PAGE_SIZE * page
      }&format=json&token_auth=${MATOMO_API_TOKEN}`,
    }
  )
  const sitesPage = response ? await response.json() : []

  if (sitesPage.length === 0) {
    return sites
  } else {
    return fetchUserSites(msDelay, user, [...sites, ...sitesPage], page + 1)
  }
}

export const fetchMatomoUsers = async (
  msDelay: number,
  users: { sites: Record<string, unknown>[] }[] = [],
  page = 0
): Promise<Record<string, unknown>[]> => {
  const response = await fetcher(
    "https://matomo.fabrique.social.gouv.fr/index.php",
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: `module=API&method=UsersManager.getUsers&filter_limit=${PAGE_SIZE}&filter_offset=${
        PAGE_SIZE * page
      }&format=json&token_auth=${MATOMO_API_TOKEN}`,
    }
  )
  const usersPage = response ? await response.json() : []
  if (usersPage.length === 0) {
    const usersWithSites = await Promise.all(
      users.map(async (user) => ({
        ...formatUser(user),
        sites: await fetchUserSites(msDelay, user),
      }))
    )
    return fetchSitesNames(msDelay, usersWithSites)
  } else {
    await setTimeout(msDelay) // so that we don't spam the remote API
    return fetchMatomoUsers(msDelay, [...users, ...usersPage], page + 1)
  }
}
