import Link from "next/link"
import { useRouter } from "next/router"

import Navigation from "@/components/navigation"
import Logo from "@/components/common/site-logo"
import AuthenticatedUser from "@/components/authenticated-user"

const Header = () => {
  const router = useRouter()
  const { pathname } = router

  return (
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
          <AuthenticatedUser />
        </nav>
      </div>
      {["/accounts", "onboarding-requests", "/onboarding-requests"].includes(
        pathname
      ) && <Navigation />}
    </header>
  )
}

export default Header
