import Link from "next/link"
import { useSession } from "next-auth/react"

import Navigation from "@/components/navigation"
import Logo from "@/components/common/site-logo"
import AuthenticatedUser from "@/components/authenticated-user"

const Header = () => {
  const { data: session } = useSession()

  return (
    <header className="header">
      <div className="header-content">
        <Link href="/">
          <a>
            <Logo />
            <div className="title">
              <h1>Secretariat</h1>
              <p>Gestion des comptes de la Fabrique Numérique</p>
            </div>
          </a>
        </Link>
        <nav>
          <AuthenticatedUser />
        </nav>
      </div>
      {session && <Navigation />}
    </header>
  )
}

export default Header
