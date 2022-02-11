import { NEXTCLOUD_API_LOGIN, NEXTCLOUD_API_SECRET } from "@/utils/env"
import pMap from "p-map"
import { setTimeout } from "timers/promises"
import { DEFAULT_DELAY, FetchedData } from "../fetch"

const fetchNextcloudUser = async (login: string) => {
  const user = await fetch(
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
  return user.json()
}

export const fetchNextcloudUsers = async (
  msDelay = DEFAULT_DELAY
): Promise<FetchedData> => {
  const response = await fetch(
    "https://nextcloud.fabrique.social.gouv.fr/ocs/v1.php/cloud/users",
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

  // Nextcloud only sends us a list of logins, we need to query each user's details
  const {
    ocs: {
      data: { users: logins },
    },
  } = await response.json()
  const users = pMap(
    logins,
    async (login: string, index: number) => {
      const {
        ocs: { data: user },
      } = await fetchNextcloudUser(login)
      console.log(`fetched Nextcloud user ${index + 1}/${logins.length}`)
      await setTimeout(msDelay)
      return user
    },
    { concurrency: 1 }
  )

  return users
}
