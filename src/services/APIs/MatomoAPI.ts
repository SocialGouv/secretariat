import AbstractServiceAPI from "@/services/APIs/AbstractServiceAPI"

class MatomoAPI extends AbstractServiceAPI {
  service_name = "matomo"

  constructor() {
    super(["MATOMO_API_TOKEN"])
  }

  async fetch_data(): Promise<object> {
    const response = await fetch(
      "https://matomo.fabrique.social.gouv.fr/index.php",
      {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        body: `module=API&method=UsersManager.getUsers&format=json&token_auth=${process.env.MATOMO_API_TOKEN}`,
      }
    )
    return response.json()
  }
}

export default MatomoAPI
