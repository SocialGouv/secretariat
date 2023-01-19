import Head from "next/head"
import Link from "next/link"
import Image from "next/image"

const Onboarding = () => (
  <main className="flex flex-col pt-12">
    <Head>
      <title>Secrétariat</title>
    </Head>
    <div className="relative flex flex-1 justify-center">
      <div className="flex-1 flex items-center bg-red-50 rounded">
        <Image
          priority
          width={800}
          height={522}
          src="/images/onboarding.png"
          alt="illustration embarquement"
        />
      </div>
      <div className="flex flex-col gap-12 flex-2 ml-24 justify-center">
        <div>
          <h2 className="text-6xl">Embarquement</h2>
          <p className="text-2xl">
            à la Fabrique Numérique des Ministères Sociaux
          </p>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center py-8">
            <i className="ri-timer-line ri-4x text-blue-france-113-main" />
            <p className="text-lg ml-6 flex-1">
              Effectuez votre demande d&apos;
              <strong>embarquement en quelques instants</strong> !
            </p>
          </div>
          <hr />
          <div className="flex items-center py-8">
            <i className="ri-mail-line ri-4x text-blue-france-113-main" />
            <p className="text-lg ml-6 flex-1">
              Utilisez l&apos;email de vérification pour{" "}
              <strong>
                confirmer l&apos;authenticité de votre adresse email
              </strong>
              .
            </p>
          </div>
          <hr />
          <div className="flex items-center py-8">
            <i className="ri-lock-unlock-line ri-4x text-blue-france-113-main" />
            <p className="text-lg ml-6 flex-1">
              Obtenez vos{" "}
              <strong>accès aux services mis à votre disposition</strong> par la
              Fabrique Numérique.
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <Link href="/onboarding/request">
            <a className="flex leading-8 btn primary items-center text-3xl py-6 bg-red-marianne-425-main">
              Commencer
              <i className="ri-arrow-right-s-line relative left-2" />
            </a>
          </Link>
        </div>
      </div>
    </div>
  </main>
)

export default Onboarding
