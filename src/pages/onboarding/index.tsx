import Head from "next/head"
import { useSession } from "next-auth/react"

import OnboardingForm from "@/components/onboarding-form"
import OnboardingHeader from "@/components/onboarding-header"

const Onboarding = () => {
  const { data: session } = useSession()

  return (
    <main className={session ? "mt-12" : ""}>
      <Head>
        <title>Secrétariat</title>
      </Head>
      <OnboardingHeader />
      <OnboardingForm />
    </main>
  )
}

export default Onboarding
