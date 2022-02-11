import { MATOMO_API_TOKEN } from "@/utils/env"
import { randomUUID } from "crypto"
import { FetchedData } from "../fetch"

export const fetchMatomoUsers = async (): Promise<FetchedData> => {
  const response = await fetch(
    "https://matomo.fabrique.social.gouv.fr/index.php",
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: `module=API&method=UsersManager.getUsers&format=json&token_auth=${MATOMO_API_TOKEN}`,
    }
  )
  const users: Record<string, unknown>[] = await response.json()
  return users.map((user) => ({
    ...user,
    id: randomUUID(),
  }))
}
