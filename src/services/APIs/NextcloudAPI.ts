import AbstractServiceAPI from "@/services/APIs/AbstractServiceAPI"

interface NextcloudData {
  ocs: {
    data: {
      users: string[]
    }
  }
}

class NextcloudAPI extends AbstractServiceAPI {
  service_name = "nextcloud"

  constructor() {
    super(["NEXTCLOUD_API_LOGIN", "NEXTCLOUD_API_SECRET"])
  }

  format_data(data: NextcloudData) {
    return data.ocs.data.users.map((login) => {
      return { login }
    })
  }

  async fetch_data(): Promise<Record<string, unknown>> {
    const response = await fetch(
      "https://nextcloud.fabrique.social.gouv.fr/ocs/v1.php/cloud/users",
      {
        method: "GET",
        headers: {
          "OCS-APIRequest": " true",
          Accept: " application/json",
          Authorization: `Basic ${Buffer.from(
            `${process.env.NEXTCLOUD_API_LOGIN}:${process.env.NEXTCLOUD_API_SECRET}`
          ).toString("base64")}`,
        },
      }
    )
    return response.json()
  }
}

export default NextcloudAPI
