import pMap from "p-map"
import { setTimeout } from "timers/promises"

import {
  OVH_APP_KEY,
  OVH_APP_SECRET,
  OVH_CONSUMER_KEY,
  OVH_SERVICE_NAME,
} from "@/utils/env"

const EXCLUDE_CONFIGURE_ME_ADDRESSES = true

const OvhFetcher = async (
  ovh: any,
  verb: string,
  url: string,
  emptyValue: any
) => {
  try {
    return ovh.requestPromised(verb, url)
  } catch (error) {
    console.error("Error while fetching OVH: ", error)
    return emptyValue
  }
}

const fetchOvhUser = async (ovh: any, email: string) => {
  return OvhFetcher(
    ovh,
    "GET",
    `/email/pro/${OVH_SERVICE_NAME}/account/${email}`,
    {}
  )
}

export const fetchOvhUsers = async (
  msDelay: number
): Promise<Record<string, unknown>[]> => {
  const ovh = require("ovh")({
    endpoint: "ovh-eu",
    appKey: OVH_APP_KEY,
    appSecret: OVH_APP_SECRET,
    consumerKey: OVH_CONSUMER_KEY,
  })

  const unfilteredEmails: string[] = await OvhFetcher(
    ovh,
    "GET",
    `/email/pro/${OVH_SERVICE_NAME}/account`,
    []
  )

  const emails = EXCLUDE_CONFIGURE_ME_ADDRESSES
    ? unfilteredEmails.filter((email) => !email.endsWith("@configureme.me"))
    : unfilteredEmails

  // OVH only sends us a list of emails, we need to query each user's details
  const users = await pMap(
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
