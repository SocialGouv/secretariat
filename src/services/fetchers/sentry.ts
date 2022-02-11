import { SENTRY_API_TOKEN } from "@/utils/env"
import { FetchedData } from "../fetch"

export const fetchSentryUsers = async (): Promise<FetchedData> => {
  const response = await fetch(
    "https://sentry.fabrique.social.gouv.fr/api/0/organizations/incubateur/users/",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${SENTRY_API_TOKEN}`,
      },
    }
  )
  return response.json()
}
