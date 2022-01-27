import { GraphQLClient } from "graphql-request"

const url = process.env.NEXT_PUBLIC_HASURA_URL as string

const fetcher = (query: string, token?: string, params = {}) => {
  const client = new GraphQLClient(url)
  if (token && token.length) {
    client.setHeader("authorization", `Bearer ${token}`)
  }
  return client.request(query, params)
}

export default fetcher
