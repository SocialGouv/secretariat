import Link from "next/link"

import Logo from "@/components/common/site-logo"
import AuthenticatedUser from "@/components/authenticated-user"
import ThemeToggleButton from "./theme-toggle-button"

const Header = () => (
  <header className="header">
    <div className="header-content">
      <Link href="/">
        <a>
          <Logo />
          <div className="title">
            <h1>Secretariat</h1>
            <p>Gestion des comptes de services @SocialGouv</p>
          </div>
        </a>
      </Link>
      <nav>
        <ThemeToggleButton />
        <AuthenticatedUser />
      </nav>
    </div>
  </header>
)

export default Header
