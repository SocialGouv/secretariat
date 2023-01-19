import pMap from "p-map"
import { setTimeout } from "timers/promises"

import fetcher from "@/utils/rest-fetcher"
import { NEXTCLOUD_API_LOGIN, NEXTCLOUD_API_SECRET } from "@/utils/env"
import logger from "@/utils/logger"

const PAGE_SIZE = 100 // not sure about the real max for Nextcloud's API

const fetchNextcloudUser = async (login: string) => {
  const response = await fetcher(
    `https://nextcloud.fabrique.social.gouv.fr/ocs/v1.php/cloud/users/${login}`,
    {
      method: "GET",
      headers: {
        "OCS-APIRequest": " true",
        Accept: " application/json",
        Authorization: `Basic ${Buffer.from(
          `${NEXTCLOUD_API_LOGIN}:${NEXTCLOUD_API_SECRET}`
        ).toString("base64")}`,
      },
    }
  )
  return response
    ? response.json()
    : {
        ocs: { data: {} },
      }
}

export const fetchNextcloudUsers = async (
  msDelay: number,
  logins: string[] = [],
  page = 0
): Promise<Record<string, unknown>[]> => {
  const response = await fetcher(
    `https://nextcloud.fabrique.social.gouv.fr/ocs/v1.php/cloud/users?limit=${PAGE_SIZE}&offset=${
      page * PAGE_SIZE
    }`,
    {
      method: "GET",
      headers: {
        "OCS-APIRequest": " true",
        Accept: " application/json",
        Authorization: `Basic ${Buffer.from(
          `${NEXTCLOUD_API_LOGIN}:${NEXTCLOUD_API_SECRET}`
        ).toString("base64")}`,
      },
    }
  )

  const {
    ocs: {
      data: { users: loginsPage },
    },
  } = response ? await response.json() : { ocs: { data: { users: [] } } }

  if (loginsPage.length === 0) {
    // Nextcloud only sends us a list of logins, we need to query each user's details
    // Here we are fetching even disabled users because we can't filter them in the first query
    const users = await pMap(
      logins,
      async (login: string, index: number) => {
        const {
          ocs: { data: user },
        } = await fetchNextcloudUser(login)
        logger.info(`fetched Nextcloud user ${index + 1}/${logins.length}`)
        await setTimeout(msDelay)
        return user
      },
      { concurrency: 1 }
    )
    return users.filter((user) => user.enabled)
  } else {
    await setTimeout(msDelay) // so that we don't spam the remote API
    return fetchNextcloudUsers(msDelay, [...logins, ...loginsPage], page + 1)
  }
}
