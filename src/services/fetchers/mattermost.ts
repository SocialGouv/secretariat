import { MATTERMOST_API_TOKEN } from "@/utils/env"
import { FetchedData } from "../fetch"

export const fetchMattermostUsers = async (): Promise<FetchedData> => {
  const response = await fetch(
    "https://mattermost.fabrique.social.gouv.fr/api/v4/users",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${MATTERMOST_API_TOKEN}`,
      },
    }
  )
  return response.json()
}
