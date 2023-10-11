import statusOk from "@/utils/status-ok"
import { enableGithubAccount } from "./enablers/github"
import { enableMattermostAccount } from "./enablers/mattermost"
import { enableOvhAccount } from "./enablers/ovh"

export async function enable(user: User) {
  const responses = Promise.all(
    user.services.map(async (service) => {
      if (service.type === "github") {
        const response = await enableGithubAccount(service.data.login)
        return {
          success: statusOk(response.status),
          message: await response.json(),
        }
      } else if (service.type === "mattermost") {
        const response = await enableMattermostAccount(service.data.id)
        return {
          success: statusOk(response.status),
          message: await response.json(),
        }
      } else if (service.type === "ovh") {
        const response = await enableOvhAccount(
          service.data.primaryEmailAddress,
          user.email
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
