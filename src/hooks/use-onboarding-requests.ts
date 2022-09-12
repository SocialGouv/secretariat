import useSWR from "swr"

import graphQLFetcher from "@/utils/graphql-fetcher"
import { getOnboardingRequests } from "@/queries/index"
console.log("toto")

const useOnboardingRequests = () => {
  const getOnboardingRequestsData = async () => {
    const data = await graphQLFetcher({
      query: getOnboardingRequests,
      includeCookie: true,
    })
    return data
  }

  const { data: { onboarding_requests } = {}, mutate } = useSWR(
    "/onboarding-requests",
    getOnboardingRequestsData
  )
  console.log("SWR onboarding_requests", onboarding_requests)
  return onboarding_requests
}

export default useOnboardingRequests
