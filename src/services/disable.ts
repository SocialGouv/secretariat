import statusOk from "@/utils/status-ok"
import { disableGithubAccount } from "./disablers/github"
import { disableMattermostAccount } from "./disablers/mattermost"
import { disableOvhAccount } from "./disablers/ovh"

export async function disable(
  user: User
): Promise<({ success: boolean; message: string } | null)[]> {
  const responses = Promise.all(
    user.services.map(async (service) => {
      if (service.type === "github") {
        const response = await disableGithubAccount(service.data.login)
        return {
          success: statusOk(response.status),
          message: await response.json(),
        }
      } else if (service.type === "mattermost") {
        const response = await disableMattermostAccount(service.data.id)
        return {
          success: statusOk(response.status),
          message: await response.json(),
        }
      } else if (service.type === "ovh") {
        const response = await disableOvhAccount(
          service.data.primaryEmailAddress
        )
        return {
          success: response.success,
          message: response.success ? response.data : response.error,
        }
      } else {
        return null
      }
    })
  )

  return responses
}
