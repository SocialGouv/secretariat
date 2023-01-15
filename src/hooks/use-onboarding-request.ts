import { useRouter } from "next/router"
import useSWRImmutable from "swr/immutable"

import graphQLFetcher from "@/utils/graphql-fetcher"
import { getOnboardingRequest } from "@/queries/index"

const useOnboardingRequest = () => {
  const router = useRouter()
  const { id } = router.query

  const key = id
    ? { query: getOnboardingRequest, includeCookie: true, parameters: { id } }
    : null

  const { data: { onboarding_requests: [request] = [] } = {}, mutate } =
    useSWRImmutable(key, graphQLFetcher)

  return { request, mutate, id }
}

export default useOnboardingRequest
