import { ZAMMAD_API_TOKEN } from "@/utils/env"
import { setTimeout } from "timers/promises"
import { DEFAULT_DELAY, FetchedData } from "../fetch"

const PAGE_SIZE = 200

export const fetchZammadUsers = async (
  users: Record<string, unknown>[] = [],
  page = 1,
  msDelay = DEFAULT_DELAY
): Promise<FetchedData> => {
  const response = await fetch(
    `https://pastek.fabrique.social.gouv.fr/api/v1/users/search?query=role_ids:*+AND+active:true&per_page=${PAGE_SIZE}&page=${page}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${ZAMMAD_API_TOKEN}`,
      },
    }
  )
  const usersPage = await response.json()
  if (usersPage.length === 0) {
    return users
  } else {
    await setTimeout(msDelay) // so that we don't spam the remote API
    return fetchZammadUsers([...users, ...usersPage], page + 1, msDelay)
  }
}
