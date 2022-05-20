import Head from "next/head"

import OnboardingForm from "@/components/onboarding-form"

const Onboarding = () => (
  <main>
    <Head>
      <title>Secrétariat</title>
    </Head>
    <div className="flex py-8">
      <div className="text-7xl flex items-center pr-6">🛳️</div>
      <div>
        <h2>Embarquement à la Fabrique Numérique des Ministères Sociaux</h2>
        <p className="pt-2">
          Remplissez le formulaire suivant afin d&apos;effectuer une demande
          d&apos;embarquement à la Fabrique Numérique des Ministères Sociaux.
        </p>
      </div>
    </div>
    <OnboardingForm />
  </main>
)

export default Onboarding
