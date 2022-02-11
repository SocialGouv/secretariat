import {
  OVH_APP_KEY,
  OVH_APP_SECRET,
  OVH_CONSUMER_KEY,
  OVH_SERVICE_NAME,
} from "@/utils/env"
import pMap from "p-map"
import { setTimeout } from "timers/promises"
import { DEFAULT_DELAY, FetchedData } from "../fetch"

const fetchOvhUser = async (ovh: any, email: string) => {
  const user = await ovh.requestPromised(
    "GET",
    `/email/pro/${OVH_SERVICE_NAME}/account/${email}`
  )
  return user
}

export const fetchOvhUsers = async (
  msDelay = DEFAULT_DELAY
): Promise<FetchedData> => {
  const ovh = require("ovh")({
    endpoint: "ovh-eu",
    appKey: OVH_APP_KEY,
    appSecret: OVH_APP_SECRET,
    consumerKey: OVH_CONSUMER_KEY,
  })

  const emails = await ovh.requestPromised(
    "GET",
    `/email/pro/${OVH_SERVICE_NAME}/account`
  )

  // OVH only sends us a list of emails, we need to query each user's details
  const users = pMap(
    emails,
    async (email: string, index: number) => {
      const user = await fetchOvhUser(ovh, email)
      console.log(`fetched OVH user ${index + 1}/${emails.length}`)
      await setTimeout(msDelay)
      return user
    },
    { concurrency: 1 }
  )
  return users
}
