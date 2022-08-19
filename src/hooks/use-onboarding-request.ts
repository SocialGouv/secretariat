import useSWR from "swr"
import { useRouter } from "next/router"

import graphQLFetcher from "@/utils/graphql-fetcher"
import { getOnboardingRequest } from "@/queries/index"

const useOnboardingRequest = () => {
  const router = useRouter()
  const { id } = router.query

  const key = id
    ? { query: getOnboardingRequest, includeCookie: true, parameters: { id } }
    : null

  const { data: { onboarding_requests: [request] = [] } = {}, mutate } = useSWR(
    key,
    graphQLFetcher
  )

  return { request, mutate }
}

export default useOnboardingRequest
