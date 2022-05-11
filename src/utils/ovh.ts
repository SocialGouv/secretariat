import { OVH_APP_KEY, OVH_APP_SECRET, OVH_CONSUMER_KEY } from "./env"

const ovh = async (
  method: string,
  url: string,
  data: Record<string, unknown> = {}
): Promise<{
  success: boolean
  data: any
  error: Record<string, unknown>
}> => {
  const ovh = require("ovh")({
    endpoint: "ovh-eu",
    appKey: OVH_APP_KEY,
    appSecret: OVH_APP_SECRET,
    consumerKey: OVH_CONSUMER_KEY,
  })

  try {
    // return await to raise the exception here
    return {
      success: true,
      data: await ovh.requestPromised(method, url, data),
      error: {},
    }
  } catch (error) {
    console.error("Error while querying OVH: ", error)
    return {
      success: false,
      error: error as { error: number; message: string },
      data: {},
    }
  }
}

export default ovh
