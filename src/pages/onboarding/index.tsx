import Head from "next/head"

import OnboardingForm from "@/components/onboarding-form"
import OnboardingHeader from "@/components/onboarding-header"

const Onboarding = () => (
  <main>
    <Head>
      <title>Secrétariat</title>
    </Head>
    <OnboardingHeader />
    <OnboardingForm />
  </main>
)

export default Onboarding
