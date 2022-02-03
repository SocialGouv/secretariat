import AbstractServiceAPI from "@/services/APIs/AbstractServiceAPI"

class ZammadAPI extends AbstractServiceAPI {
  service_name = "zammad"

  constructor() {
    super(["ZAMMAD_API_TOKEN"])
  }

  async fetch_data(): Promise<object> {
    const response = await fetch(
      "https://pastek.fabrique.social.gouv.fr/api/v1/users",
      {
        method: "GET",
        headers: {
          Authorization: process.env.ZAMMAD_API_TOKEN as string,
        },
      }
    )
    return response.json()
  }
}

export default ZammadAPI
