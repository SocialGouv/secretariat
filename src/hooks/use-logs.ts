import useSWR from "swr"

import graphQLFetcher from "@/utils/graphql-fetcher"
import { getLogs } from "@/queries/index"

const useOnboardingRequests = () => {
  const getOnboardingRequestsData = async () => {
    const data = await graphQLFetcher({
      query: getLogs,
      includeCookie: true,
    })
    return data
  }

  const { data: { logs } = {}, mutate } = useSWR(
    "/logs",
    getOnboardingRequestsData
  )

  return logs
}

export default useOnboardingRequests
