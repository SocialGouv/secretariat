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

// const logAction = (
//   token: string | null,
//   user: string | null,
//   action: string,
//   parameters: string | null = null
// ) => {
//   graphQLFetcher(insertLog, token, {
//     ...(user !== null && { user }),
//     action,
//     ...(parameters !== null && { parameters }),
//   })
// }

export default logAction
