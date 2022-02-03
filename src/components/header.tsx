import Link from "next/link"

import Logo from "@/components/common/logo"
import AuthenticatedUser from "@/components/authenticated-user"

const Header = () => (
  <header className="header">
    <div className="container">
      <Link href="/">
        <a>
          <Logo />
          <div className="title">
            <h1>Secretariat</h1>
            <p>Gestion des comptes et services @SocialGouv</p>
          </div>
        </a>
      </Link>
      <nav>
        {/* <Link href="/stat">
          <a>
            <i className="ri-bar-chart-fill" />
            Statistiques
          </a>
        </Link> */}
        <AuthenticatedUser />
      </nav>
    </div>
  </header>
)

export default Header
