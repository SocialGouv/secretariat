import { GraphQLClient } from "graphql-request"
import { NEXT_PUBLIC_HASURA_URL } from "./env"

const graphQLFetcher = ({
  query,
  includeCookie,
  token,
  parameters,
}: GraphQLFetcherParams) => {
  let options = {}
  if (includeCookie) {
    options = { ...options, credentials: "include" }
  } else if (token) {
    options = {
      ...options,
      credentials: "omit",
      headers: { Cookie: `next-auth.session-token=${token}` },
    }
  }

  const client = new GraphQLClient(NEXT_PUBLIC_HASURA_URL, options)

  return client.request(query, parameters)
}

export default graphQLFetcher
