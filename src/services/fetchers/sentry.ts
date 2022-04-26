import fetcher from "@/utils/rest-fetcher"
import { SENTRY_API_TOKEN } from "@/utils/env"

export const fetchSentryUsers = async (): Promise<
  Record<string, unknown>[]
> => {
  const response = await fetcher(
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
