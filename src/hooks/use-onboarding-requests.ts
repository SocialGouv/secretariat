import useSWR from "swr"

import graphQLFetcher from "@/utils/graphql-fetcher"
import { getOnboardingRequests } from "@/queries/index"

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
  return onboarding_requests
}

export default useOnboardingRequests
