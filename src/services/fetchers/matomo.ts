import { MATOMO_API_TOKEN } from "@/utils/env"
import fetcher from "@/utils/rest-fetcher"
import { randomUUID } from "crypto"
import { setTimeout } from "timers/promises"

const PAGE_SIZE = 100 // maximum for Matomo's API

const formatUsers = (users: Record<string, unknown>[]) => {
  return users.map((user) => ({
    ...user,
    id: randomUUID(),
  }))
}

export const fetchMatomoUsers = async (
  msDelay: number,
  users: Record<string, unknown>[] = [],
  page: number = 0
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
    return formatUsers(users)
  } else {
    await setTimeout(msDelay) // so that we don't spam the remote API
    return fetchMatomoUsers(msDelay, [...users, ...usersPage], page + 1)
  }
}
