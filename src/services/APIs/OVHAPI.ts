import AbstractServiceAPI from "@/services/APIs/AbstractServiceAPI"

class OVHAPI extends AbstractServiceAPI {
  serviceName = "ovh"

  formatData(data: string[]): object {
    return data.map((email) => ({
      email,
    }))
  }

  async fetchData(): Promise<object> {
    for (let envKey of [
      "OVH_APP_KEY",
      "OVH_APP_SECRET",
      "OVH_CONSUMER_KEY",
      "OVH_SERVICE_NAME",
    ]) {
      if (!process.env[envKey]) {
        throw ReferenceError(`Could not find ${envKey} environment variable`)
      }
    }

    const ovh = require("ovh")({
      endpoint: "ovh-eu",
      appKey: process.env.OVH_APP_KEY,
      appSecret: process.env.OVH_APP_SECRET,
      consumerKey: process.env.OVH_CONSUMER_KEY,
    })

    return ovh.requestPromised(
      "GET",
      `/email/pro/${process.env.OVH_SERVICE_NAME}/account`
    )
  }
}

export default OVHAPI
