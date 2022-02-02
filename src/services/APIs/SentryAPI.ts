import AbstractServiceAPI from "@/services/APIs/AbstractServiceAPI"

class SentryAPI extends AbstractServiceAPI {
  serviceName = "sentry"

  async fetchData(): Promise<object> {
    if (!process.env.SENTRY_API_TOKEN) {
      throw ReferenceError(
        "Could not find SENTRY_API_TOKEN environment variable"
      )
    }

    const response = await fetch(
      "https://sentry.fabrique.social.gouv.fr/api/0/organizations/incubateur/users/",
      {
        method: "GET",
        headers: {
          Authorization: process.env.SENTRY_API_TOKEN,
        },
      }
    )
    return await response.json()
  }
}

export default SentryAPI
