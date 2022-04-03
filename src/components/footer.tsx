import Link from "next/link"

import Logo from "@/components/common/site-logo"

const Footer = () => (
  <footer>
    <div className="footer-content">
      <div className="logo-info">
        <Logo big />
        <div className="info">
          <p>
            <strong>Secretariat</strong> est une application permettant de gérer
            les accès des utilisateurs aux services de la Fabrique Numérique.
          </p>
          <p>
            Pour en savoir plus sur l&apos;utilisation de{" "}
            <strong>Secretariat</strong>, visitez le{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/SocialGouv/www/wiki/Inscrire-son-%C3%A9quipe-au-standup"
            >
              wiki
            </a>
            .
          </p>
          <p className="flex items-center">
            <i className="ri-github-fill ri-xl relative top-px mr-1" />
            version {process.env.NEXT_PUBLIC_APP_VERSION} (
            <a
              target="_blank"
              href={`${process.env.NEXT_PUBLIC_APP_REPOSITORY_URL}/tree/${process.env.NEXT_PUBLIC_APP_VERSION_COMMIT}`}
              rel="noreferrer"
            >
              {process.env.NEXT_PUBLIC_APP_VERSION_COMMIT?.substring(0, 8)}
            </a>
            )
          </p>
        </div>
      </div>
      <div className="links">
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.fabrique.social.gouv.fr/"
        >
          La Fabrique Numérique
        </a>
        <Link href="/legal">
          <a>Mentions légales</a>
        </Link>
        <a href="#">Paramètres d&apos;affichage</a>
      </div>
    </div>
  </footer>
)

export default Footer
