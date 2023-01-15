import Head from "next/head"

import Onboarding from "@/components/onboarding"
import OnboardingHeader from "@/components/onboarding/header"

const Request = () => (
  <main className="flex flex-col pt-8 gap-8">
    <Head>
      <title>Secrétariat</title>
    </Head>
    <OnboardingHeader />
    <Onboarding />
  </main>
)

export default Request
