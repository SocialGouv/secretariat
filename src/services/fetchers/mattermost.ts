import { MATTERMOST_API_TOKEN } from "@/utils/env"
import fetcher from "@/utils/rest-fetcher"
import { setTimeout } from "timers/promises"
import { DEFAULT_DELAY } from "../fetch"

const PAGE_SIZE = 200 // maximum for Mattermost's API

export const fetchMattermostUsers = async (
  users: Record<string, unknown>[] = [],
  page: number = 0,
  msDelay = DEFAULT_DELAY
): Promise<Record<string, unknown>[]> => {
  const response = await fetcher(
    `https://mattermost.fabrique.social.gouv.fr/api/v4/users?page=${page}&per_page=${PAGE_SIZE}&active=true`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${MATTERMOST_API_TOKEN}`,
      },
    }
  )
  const usersPage = response ? await response.json() : []
  if (usersPage.length === 0) {
    return users
  } else {
    await setTimeout(msDelay) // so that we don't spam the remote API
    return fetchMattermostUsers([...users, ...usersPage], page + 1, msDelay)
  }
}
