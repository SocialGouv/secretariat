import Head from "next/head"
import Link from "next/link"
import Image from "next/image"

const Onboarding = () => (
  <main className="flex flex-col mt-8 px-12">
    <Head>
      <title>Secrétariat</title>
    </Head>
    <h2 className="text-4xl mb-6">
      Embarquement à la Fabrique Numérique des Ministères Sociaux
    </h2>
    <div className="relative flex flex-1 items-center justify-center">
      <Image
        width={800}
        height={522}
        src="/images/welcome.png"
        alt="illustration embarquement"
      />
    </div>
    <p className="mb-2 mt-6 text-lg">
      Effectuez votre demande d&apos;
      <strong>embarquement en quelques instants</strong> !
    </p>
    <p className="text-lg">
      Une fois votre demande validée, obtenez vos{" "}
      <strong>accès aux services mis à votre disposition</strong> par la
      Fabrique Numérique.
    </p>
    <div className="flex justify-center mt-6">
      <Link href="/onboarding/request">
        <a className="flex btn primary items-center text-2xl">
          Commencer
          <i className="ri-arrow-right-s-line ri-xl relative left-2" />
        </a>
      </Link>
    </div>
  </main>
)

export default Onboarding
