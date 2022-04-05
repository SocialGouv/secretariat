import { ZAMMAD_API_TOKEN } from "@/utils/env"
import fetcher from "@/utils/rest-fetcher"
import { setTimeout } from "timers/promises"

const PAGE_SIZE = 200

const fetchZammadGroups = async (): Promise<{ id: number }[]> => {
  const response = await fetcher(
    `https://pastek.fabrique.social.gouv.fr/api/v1/groups`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${ZAMMAD_API_TOKEN}`,
      },
    }
  )
  return response?.json()
}

export const fetchZammadUsers = async (
  msDelay: number,
  users: { group_ids: Record<string, unknown> }[] = [],
  page = 1
): Promise<Record<string, unknown>[]> => {
  const response = await fetcher(
    `https://pastek.fabrique.social.gouv.fr/api/v1/users/search?query=role_ids:*+AND+active:true&per_page=${PAGE_SIZE}&page=${page}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${ZAMMAD_API_TOKEN}`,
      },
    }
  )
  const usersPage = response ? await response.json() : []
  await setTimeout(msDelay) // so that we don't spam the remote API
  if (usersPage.length === 0) {
    const allGroups = await fetchZammadGroups()
    return users.map((user) => ({
      ...user,
      groups: allGroups.filter((group) =>
        Object.keys(user.group_ids).includes(group.id.toString())
      ),
    }))
  } else {
    return fetchZammadUsers(msDelay, [...users, ...usersPage], page + 1)
  }
}
