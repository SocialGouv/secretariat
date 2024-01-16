import graphQLFetcher, {
  type GraphQLFetcherParams,
} from "@/utils/graphql-fetcher"
import { HASURA_URL } from "./env"

export default function graphQLServiceFetcher({
  ...args
}: GraphQLFetcherParams) {
  const url = HASURA_URL
  return graphQLFetcher.call(undefined, { ...args, url })
}
