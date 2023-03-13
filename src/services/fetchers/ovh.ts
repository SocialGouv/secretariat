import pMap from "p-map"
import { setTimeout } from "timers/promises"

import { OVH_SERVICE_NAME } from "@/utils/env"
import ovh from "@/utils/ovh"
import logger from "@/utils/logger"

export const fetchOvhUsers = async (
  msDelay: number
): Promise<Record<string, unknown>[]> => {
  const response = await ovh(
    "GET",
    `/email/exchange/${OVH_SERVICE_NAME}/service/${OVH_SERVICE_NAME}/account`
  )
  const emails: string[] = response.success
    ? response.data.filter(
        (email: string) => !email.endsWith("@configureme.me")
      )
    : []

  // OVH only sends us a list of emails, we need to query each user's details
  const users = await pMap(
    emails,
    async (email: string, index: number) => {
      const response = await ovh(
        "GET",
        `/email/exchange/${OVH_SERVICE_NAME}/service/${OVH_SERVICE_NAME}/account/${email}`
      )
      logger.info(`fetched OVH user ${index + 1}/${emails.length}`)
      await setTimeout(msDelay)
      return response.success ? response.data : {}
    },
    { concurrency: 1 }
  )
  return users
}
