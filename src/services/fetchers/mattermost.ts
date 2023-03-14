import pMap from "p-map"
import { setTimeout } from "timers/promises"

import fetcher from "@/utils/rest-fetcher"
import { MATTERMOST_API_TOKEN } from "@/utils/env"

const PAGE_SIZE = 200 // maximum for Mattermost's API

const fetchMattermostTeams = async (
  msDelay: number,
  teams: { id: string }[] = [],
  page = 0
): Promise<{ id: string }[]> => {
  const response = await fetcher(
    `https://mattermost.fabrique.social.gouv.fr/api/v4/teams?page=${page}&per_page=${PAGE_SIZE}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${MATTERMOST_API_TOKEN}`,
      },
    }
  )
  const teamsPage = response ? await response.json() : []
  if (teamsPage.length === 0) {
    return teams
  } else {
    await setTimeout(msDelay) // so that we don't spam the remote API
    return fetchMattermostTeams(msDelay, [...teams, ...teamsPage], page + 1)
  }
}

const fetchMattermostTeamMemberships = async (
  teamID: string,
  msDelay: number,
  members: Record<string, unknown>[] = [],
  page = 0
): Promise<Record<string, unknown>[]> => {
  const response = await fetcher(
    `https://mattermost.fabrique.social.gouv.fr/api/v4/teams/${teamID}/members?page=${page}&per_page=${PAGE_SIZE}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${MATTERMOST_API_TOKEN}`,
      },
    }
  )
  const membersPage = response ? await response.json() : []
  if (membersPage.length === 0) {
    return members
  } else {
    await setTimeout(msDelay) // so that we don't spam the remote API
    return fetchMattermostTeamMemberships(
      teamID,
      msDelay,
      [...members, ...membersPage],
      page + 1
    )
  }
}

export const fetchMattermostUsers = async (
  msDelay: number,
  users: Record<string, unknown>[] = [],
  page = 0
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
    const teams = await pMap(
      await fetchMattermostTeams(msDelay),
      async (team) => ({
        ...team,
        memberships: await fetchMattermostTeamMemberships(team.id, msDelay),
      }),
      { concurrency: 1 }
    )
    return users.map((user) => ({
      ...user,
      teams: teams
        .filter((team) =>
          team.memberships.some((membership) => membership.user_id === user.id)
        )
        .map(({ memberships: _memberships, ...team }) => team),
    }))
  } else {
    await setTimeout(msDelay) // so that we don't spam the remote API
    return fetchMattermostUsers(msDelay, [...users, ...usersPage], page + 1)
  }
}
