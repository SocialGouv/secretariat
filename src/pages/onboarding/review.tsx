import Head from "next/head"
import { useSession } from "next-auth/react"

import Login from "@/components/login"
import Onboarding from "@/components/onboarding"
import OnboardingHeader from "@/components/onboarding/header"

const Review = () => {
  const { data: session } = useSession()

  return (
    <main>
      <Head>
        <title>Secrétariat</title>
      </Head>
      <OnboardingHeader
        text="En tant qu'administrateur, vous pouvez effectuer une revue et
            valider la demande d'embarquement d'un collaborateur à la
            Fabrique Numérique des Ministères Sociaux."
      />
      {session ? <Onboarding /> : <Login />}
    </main>
  )
}

export default Review
