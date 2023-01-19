import Head from "next/head"
import Image from "next/image"

import Alert from "@/components/common/alert"
import OnboardingHeader from "@/components/onboarding/header"

const Confirm = () => (
  <main className="flex flex-col pt-12 gap-12">
    <Head>
      <title>Secrétariat</title>
    </Head>
    <OnboardingHeader />
    <div className="flex flex-col flex-1 gap-12">
      <Alert type="info" title="Adresse email confirmée">
        <>
          Merci d&apos;avoir effectué la confirmation de votre adresse email.
          Votre requête d&apos;embarquement a été soumise à un administrateur
          pour revue.
        </>
      </Alert>
      <div className="flex-1 relative flex justify-center">
        <Image
          priority
          width={916}
          height={600}
          src="/images/email-confirmed.png"
          alt="illustration email envoyé"
        />
      </div>
    </div>
  </main>
)

export default Confirm
