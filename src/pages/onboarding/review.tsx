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
      <div className="flex mt-8">
        <div className="text-7xl flex items-center pr-6">🛳️</div>
        <div>
          <h2>Embarquement à la Fabrique Numérique des Ministères Sociaux</h2>
          <p className="pt-2">
            Effectuez une revue et validez la demande d&apos;embarquement à la
            Fabrique Numérique des Ministères Sociaux.
          </p>
        </div>
      </div>
      {session ? <OnboardingForm request={request} /> : <Login />}
    </main>
  )
}

export default Review
