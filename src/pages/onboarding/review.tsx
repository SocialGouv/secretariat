import Head from "next/head"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

import Login from "@/components/login"
import OnboardingForm from "@/components/onboarding-form"
import useSWR from "swr"
import { getOnboardingRequest } from "@/queries/index"
import fetcher from "@/utils/fetcher"
import useToken from "@/hooks/use-token"

const Review = () => {
  const [token] = useToken()
  const router = useRouter()
  const { id } = router.query
  const { data: session } = useSession()

  console.log("session", session, id)

  const { data: { onboarding_requests: [request] = [] } = {} } = useSWR(
    token ? [getOnboardingRequest, token, { id }] : null,
    fetcher
  )

  console.log("DATA", request)

  return (
    <main>
      <Head>
        <title>Secrétariat</title>
      </Head>
      {session ? <OnboardingForm request={request} /> : <Login />}
    </main>
  )
}

export default Review
