import Head from "next/head"
import { useSession } from "next-auth/react"

import Login from "@/components/login"
import OnboardingRequestsList from "@/components/onboarding-requests-list"

const OnboardingRequests = () => {
  const { data: session } = useSession()

  return (
    <main>
      <Head>
        <title>Secrétariat</title>
      </Head>
      {session ? (
        <>
          <OnboardingRequestsList />
        </>
      ) : (
        <Login />
      )}
    </main>
  )
}

export default OnboardingRequests
