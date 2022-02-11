import { MATTERMOST_API_TOKEN } from "@/utils/env"
import { setTimeout } from "timers/promises"
import { DEFAULT_DELAY } from "../fetch"

export const fetchMattermostUsers = async (
  users: Record<string, unknown>[] = [],
  page: number = 0,
  msDelay = DEFAULT_DELAY
): Promise<Record<string, unknown>[]> => {
  const response = await fetch(
    `https://mattermost.fabrique.social.gouv.fr/api/v4/users?page=${page}&per_page=200&active=true`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${MATTERMOST_API_TOKEN}`,
      },
    }
  )
  const usersPage: Record<string, unknown>[] = await response.json()
  if (usersPage.length === 0) {
    return users
  } else {
    await setTimeout(msDelay) // so that we don't spam the remote API
    return [...users, ...(await fetchMattermostUsers(users, page + 1))]
  }
}
