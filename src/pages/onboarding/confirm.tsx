import Head from "next/head"

import Alert from "@/components/common/alert"
import OnboardingHeader from "@/components/onboarding/header"

const Confirm = () => (
  <main>
    <Head>
      <title>Secrétariat</title>
    </Head>
    <OnboardingHeader />
    <Alert
      type="info"
      title="Adresse email confirmée"
      message="Merci d'avoir effectué la confirmation de votre adresse email. Votre requête a été soumise à un administrateur pour revue."
    />
  </main>
)

export default Confirm
