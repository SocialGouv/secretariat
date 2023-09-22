import { enableGithubAccount } from "./enablers/github"
import { enableMattermostAccount } from "./enablers/mattermost"

export async function enable(user: User) {
  const responses = Promise.all(
    user.services.map((service) => {
      if (service.type === "github") {
        return enableGithubAccount(service.data.login)
      } else if (service.type === "mattermost") {
        return enableMattermostAccount(service.data.id)
      } else {
        return null
      }
    })
  )

  return responses
}
