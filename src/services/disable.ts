import { disableGithubAccount } from "./disablers/github"
import { disableMattermostAccount } from "./disablers/mattermost"
import { disableOvhAccount } from "./disablers/ovh"

export async function disable(user: User) {
  const responses = Promise.all(
    user.services.map((service) => {
      if (service.type === "github") {
        return disableGithubAccount(service.data.login)
      } else if (service.type === "mattermost") {
        return disableMattermostAccount(service.data.id)
      } else if (service.type === "ovh") {
        return disableOvhAccount(service.data.primaryEmailAddress)
      } else {
        return null
      }
    })
  )

  return responses
}
