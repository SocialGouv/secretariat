import { ZAMMAD_API_TOKEN } from "@/utils/env"
import { FetchedData } from "../fetch"

export const fetchZammadUsers = async (): Promise<FetchedData> => {
  const response = await fetch(
    "https://pastek.fabrique.social.gouv.fr/api/v1/users/search?query=role_ids:*+AND+active:true",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${ZAMMAD_API_TOKEN}`,
      },
    }
  )
  return response.json()
}
