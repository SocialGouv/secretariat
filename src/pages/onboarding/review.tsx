import Head from "next/head"
import { useSession } from "next-auth/react"

import Login from "@/components/login"
import OnboardingForm from "@/components/onboarding-form"

const Review = () => {
  const { data: session } = useSession()

  return (
    <main className={session ? "mt-12" : ""}>
      <Head>
        <title>Secrétariat</title>
      </Head>
      <div className="flex py-8">
        <div className="text-7xl flex items-center pr-6">🛳️</div>
        <div>
          <h2>Embarquement à la Fabrique Numérique des Ministères Sociaux</h2>
          <p className="pt-2">
            En tant qu&apos;administrateur, vous pouvez effectuer une revue et
            valider la demande d&apos;embarquement à la Fabrique Numérique des
            Ministères Sociaux.
          </p>
        </div>
      </div>
      {session ? <OnboardingForm /> : <Login />}
    </main>
  )
}

export default Review
