import Head from "next/head"
import { useSession } from "next-auth/react"

import Login from "@/components/login"
import Onboarding from "@/components/onboarding"
import OnboardingHeader from "@/components/onboarding/header"

const Review = () => {
  const { data: session } = useSession()

  return (
    <main className="flex flex-col pt-12 gap-12">
      <Head>
        <title>Secrétariat</title>
      </Head>
      <OnboardingHeader
        text="En tant qu'administrateur, effectuez une revue et
            validez la demande d'embarquement."
      />
      {session ? <Onboarding /> : <Login />}
    </main>
  )
}

export default Review
