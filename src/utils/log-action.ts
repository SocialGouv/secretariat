import { insertLog } from "../queries"
import graphQLFetcher from "./graphql-fetcher"

interface LogActionParameters {
  action: string
  user?: string
  parameters?: string
  token?: string
}

const logAction = ({
  action,
  user,
  parameters,
  token,
}: LogActionParameters) => {
  graphQLFetcher({
    query: insertLog,
    ...(token && { token, includeCookie: false }),
    ...(!token && { includeCookie: true }),
    parameters: {
      ...(user && { user }),
      action,
      ...(parameters && { parameters }),
    },
  })
}

export default logAction
