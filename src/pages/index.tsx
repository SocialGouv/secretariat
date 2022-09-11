import Head from "next/head"
import Link from "next/link"
import Image from "next/image"

import HomeImage from "../../public/images/home.svg"

const Index = () => (
  <main>
    <Head>
      <title>Secrétariat</title>
    </Head>
    <div className="flex mt-12">
      <div className="flex flex-col flex-1 justify-center  p-6">
        <h2 className="text-4xl">
          Secrétariat de la Fabrique Numérique des ministères sociaux
        </h2>
        <p className="mt-6">
          La loi du 24 décembre 2021 visant à accélérer l&apos;égalité
          économique et professionnelle a créé une obligation de représentation
          équilibrée entre les femmes et les hommes parmi les cadres dirigeants
          et les membres des instances dirigeantes des grandes entreprises,
          accompagnée d&apos;une obligation de transparence en la matière.
        </p>
      </div>
      <div className="flex-1 relative">
        <Image src={HomeImage} alt="home image" layout="fill" />
      </div>
    </div>
    <div className="flex mt-12 gap-x-6">
      <div className="card">
        <h3 className="title">Effectuez une demande d&apos;onboarding</h3>
        <p>
          Vous arrivez aux ministères sociaux, vous avez besoins de créer vos
          comptes afin d&apos;accéder aux services de la Fabrique Numérique,
          effectuez une demande d&apos;onboarding en cliquant sur le bouton
          ci-dessous.
        </p>
        <Link href="/onboarding">
          <a className="btn primary">Demande d&apos;onboarging</a>
        </Link>
      </div>
      <div className="card">
        <h3 className="title">Administrer les comptes utilisateurs</h3>
        <p>
          Vous souhaitez effectuer une revue des comptes des utilisateurs des
          services de la Fabrique Numérique des ministères sociaux, accèder aux
          outils de gestion en cliquant sur le bouton ci-dessous.
        </p>
        <Link href="/accounts">
          <a className="btn primary">Gestion des comptes</a>
        </Link>
      </div>
    </div>
  </main>
)

export default Index
