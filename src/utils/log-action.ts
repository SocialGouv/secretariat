import { insertLog } from "../queries"
import fetcher from "./fetcher"

const logAction = (
  token: string,
  user: string | null,
  action: string,
  parameters: string | null = null
) => {
  fetcher(insertLog, token, {
    ...(user !== null && { user }),
    action,
    ...(parameters !== null && { parameters }),
  })
}

export default logAction
