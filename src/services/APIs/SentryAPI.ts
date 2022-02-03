import AbstractServiceAPI from "@/services/APIs/AbstractServiceAPI"

class SentryAPI extends AbstractServiceAPI {
  service_name = "sentry"

  constructor() {
    super(["SENTRY_API_TOKEN"])
  }

  async fetch_data(): Promise<object> {
    const response = await fetch(
      "https://sentry.fabrique.social.gouv.fr/api/0/organizations/incubateur/users/",
      {
        method: "GET",
        headers: {
          Authorization: process.env.SENTRY_API_TOKEN as string,
        },
      }
    )
    return await response.json()
  }
}

export default SentryAPI
