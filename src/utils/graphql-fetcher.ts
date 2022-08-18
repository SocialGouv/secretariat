import { GraphQLClient } from "graphql-request"

const url = process.env.NEXT_PUBLIC_HASURA_URL as string

const graphQLFetcher = (query: string, auth?: string, params = {}) => {
  let options = {}

  if (auth === "include") {
    options = { ...options, credentials: "include" }
  } else if (auth) {
    options = {
      ...options,
      credentials: "omit",
      headers: { authorization: `Bearer ${auth}` },
    }
  }

  const client = new GraphQLClient(url, options)

  return client.request(query, params)
}

export default graphQLFetcher
