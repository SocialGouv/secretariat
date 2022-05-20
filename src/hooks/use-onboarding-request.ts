import useSWR from "swr"
import { useRouter } from "next/router"

import fetcher from "@/utils/fetcher"
import useToken from "@/hooks/use-token"
import { getOnboardingRequest } from "@/queries/index"

const useOnboardingRequest = () => {
  const [token] = useToken()
  const router = useRouter()
  const { id } = router.query

  const key = token && id ? [getOnboardingRequest, token, { id }] : null

  const { data: { onboarding_requests: [request] = [] } = {}, mutate } = useSWR(
    key,
    fetcher
  )

  return { request, mutate }
}

export default useOnboardingRequest
