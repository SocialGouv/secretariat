import { SENTRY_API_TOKEN } from "@/utils/env"
import fetcherRest from "@/utils/fetcher-rest"

export const fetchSentryUsers = async (): Promise<
  Record<string, unknown>[]
> => {
  const response = await fetcherRest(
    "https://sentry.fabrique.social.gouv.fr/api/0/organizations/incubateur/users/",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${SENTRY_API_TOKEN}`,
      },
    }
  )
  return response ? response.json() : []
}
