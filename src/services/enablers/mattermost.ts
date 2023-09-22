import { MATTERMOST_API_TOKEN } from "@/utils/env"

export function enableMattermostAccount(id: string) {
  return fetch(
    `https://mattermost.fabrique.social.gouv.fr/api/v4/users/${id}/active`,
    {
      method: "PUT",
      headers: {
        authorization: `Bearer ${MATTERMOST_API_TOKEN}`,
      },
      body: JSON.stringify({ active: true }),
    }
  )
}
