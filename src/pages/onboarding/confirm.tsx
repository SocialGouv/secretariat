import Head from "next/head"

import Alert from "@/components/common/alert"
import OnboardingHeader from "@/components/onboarding/header"

const Confirm = () => (
  <main className="flex flex-col pt-12 gap-12">
    <Head>
      <title>Secrétariat</title>
    </Head>
    <OnboardingHeader />
    <div className="mx-8">
      <Alert type="info" title="Adresse email confirmée">
        <>
          Merci d&apos;avoir effectué la confirmation de votre adresse email.
          Votre requête a été soumise à un administrateur pour revue.
        </>
      </Alert>
    </div>
  </main>
)

export default Confirm
