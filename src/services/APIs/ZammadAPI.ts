import AbstractServiceAPI from "@/services/APIs/AbstractServiceAPI"

class ZammadAPI extends AbstractServiceAPI {
  serviceName = "zammad"

  async fetchData(): Promise<object> {
    if (!process.env.ZAMMAD_API_TOKEN) {
      throw ReferenceError(
        "Could not find ZAMMAD_API_TOKEN environment variable"
      )
    }

    const response = await fetch(
      "https://pastek.fabrique.social.gouv.fr/api/v1/users",
      {
        method: "GET",
        headers: {
          Authorization: process.env.ZAMMAD_API_TOKEN,
        },
      }
    )
    return response.json()
  }
}

export default ZammadAPI
