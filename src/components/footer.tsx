import Link from "next/link"

import Logo from "@/components/common/site-logo"
import ThemeToggleButton from "@/components/theme-toggle-button"

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
          <p className="flex items-center">
            <i className="ri-github-fill ri-xl relative top-px mr-1" />
            <a
              target="_blank"
              href={`${process.env.NEXT_PUBLIC_APP_REPOSITORY_URL}`}
              rel="noreferrer"
            >
              version {process.env.NEXT_PUBLIC_APP_VERSION}
            </a>
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
        <ThemeToggleButton />
      </div>
    </div>
  </footer>
)

export default Footer
