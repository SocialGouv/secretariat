import Head from "next/head"
import Link from "next/link"
import Image from "next/image"

import HomeImage from "../../public/images/home.svg"
import Alert from "@/components/common/alert"

const Index = () => (
  <main>
    <Head>
      <title>Secrétariat</title>
    </Head>
    <div className="pt-8">
      <Alert type="warning" title="Version Beta">
        <>
          Cette application est toujours en cours de développement.
          N&apo;hésitez pas à signaler tout dysfonctionnement au support
          technique de la Fabrique Numérique.
        </>
      </Alert>
    </div>
    <div className="flex">
      <div className="flex flex-col flex-1 justify-center p-6">
        <p className="font-bold text-2xl mb-2">Bienvenue au</p>
        <h2 className="text-4xl">
          Secrétariat de la Fabrique Numérique des ministères sociaux
        </h2>
        <p className="mt-6">
          Secrétariat est une solution numérique permettant aux membres des
          Startups d&apos;Etat de gérer leurs accès aux services de la Fabrique
          Numérique des ministères sociaux.
        </p>
      </div>
      <div className="flex-1 relative min-h-[400px]">
        <Image src={HomeImage} alt="home image" layout="fill" />
      </div>
    </div>
    <div className="flex my-2 gap-x-6">
      <div className="card flex-1">
        <h3 className="title">Effectuez une demande d&apos;embarquement</h3>
        <p className="flex-1 mt-3 mb-6">
          Si vous arrivez aux ministères sociaux et que vous avez besoins de
          créer vos comptes afin d&apos;accéder aux services de la Fabrique
          Numérique, vous pouvez effectuer une demande d&apos;embarquement en
          cliquant sur le bouton ci-dessous.
        </p>
        <Link href="/onboarding">
          <a className="btn primary">Demande d&apos;embarquement</a>
        </Link>
      </div>
      <div className="card flex flex-col flex-1 items-start">
        <h3 className="title">Administrer les comptes utilisateurs</h3>
        <p className="flex-1 mt-3 mb-6">
          Si vous souhaitez effectuer une revue des comptes des utilisateurs des
          services de la Fabrique Numérique des ministères sociaux, vous pouvez
          accèder aux outils de gestion en cliquant sur le bouton ci-dessous.
        </p>
        <Link href="/accounts">
          <a className="btn primary">Gestion des comptes</a>
        </Link>
      </div>
    </div>
  </main>
)

export default Index
