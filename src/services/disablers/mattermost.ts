import { MATTERMOST_API_TOKEN } from "@/utils/env"

export function disableMattermostAccount(id: string) {
  return fetch(
    `https://mattermost.fabrique.social.gouv.fr/api/v4/users/${id}`,
    {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${MATTERMOST_API_TOKEN}`,
      },
    }
  )
}
