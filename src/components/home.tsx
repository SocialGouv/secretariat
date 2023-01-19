import Link from "next/link"
import Image from "next/image"

import HomeImage from "../../public/images/home.svg"
import Alert from "@/components/common/alert"

const Home = () => (
  <div className="home">
    <Alert type="warning" title="Version Beta">
      <>
        Cette application est toujours en cours de développement. N&apos;hésitez
        pas à signaler tout dysfonctionnement au support technique de la
        Fabrique Numérique.
      </>
    </Alert>
    <div className="jumbo">
      <div className="text">
        <p>Bienvenue au</p>
        <h2>Secrétariat de la Fabrique Numérique des ministères sociaux</h2>
        <p>
          Secrétariat est une solution numérique permettant aux membres des
          Startups d&apos;Etat de gérer leurs accès aux services de la Fabrique
          Numérique des ministères sociaux.
        </p>
      </div>
      <div className="image">
        <Image priority src={HomeImage} alt="home image" layout="fill" />
      </div>
    </div>
    <div className="tiles">
      <div className="card">
        <h3 className="title">Effectuez une demande d&apos;embarquement</h3>
        <p>
          Si vous arrivez aux ministères sociaux et que vous avez besoins de
          créer vos comptes afin d&apos;accéder aux services de la Fabrique
          Numérique, vous pouvez effectuer une demande d&apos;embarquement en
          cliquant sur le bouton ci-dessous.
        </p>
        <Link href="/onboarding">
          <a className="btn primary">Demande d&apos;embarquement</a>
        </Link>
      </div>
      <div className="card">
        <h3 className="title">Administrer les comptes utilisateurs</h3>
        <p>
          Si vous souhaitez effectuer une revue des comptes des utilisateurs des
          services de la Fabrique Numérique des ministères sociaux, vous pouvez
          accèder aux outils de gestion en cliquant sur le bouton ci-dessous.
        </p>
        <Link href="/accounts">
          <a className="btn primary">Gestion des comptes</a>
        </Link>
      </div>
    </div>
  </div>
)

export default Home
