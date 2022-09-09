import { GraphQLClient } from "graphql-request"
import { NEXT_PUBLIC_HASURA_URL } from "./env"

// Used for all GraphQL interactions with Hasura
// These can be the client and the Next.js backend
const graphQLFetcher = ({
  query,
  includeCookie,
  token,
  parameters,
}: GraphQLFetcherParams) => {
  let options = {}
  if (includeCookie) {
    // typically used by client : forward the JWT session cookie to backend
    options = { ...options, credentials: "include" }
  } else if (token) {
    // typically used by backend : include a manually forged JWT
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
