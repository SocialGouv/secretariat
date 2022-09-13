import Link from "next/link"
import { useRouter } from "next/router"

const Navigation = () => {
  const router = useRouter()
  const { route } = router

  return (
    <div className="navigation">
      <ul>
        <li>
          <Link href="/accounts">
            <a className={route === "/accounts" ? "selected" : ""}>
              Gestion des comptes
            </a>
          </Link>
        </li>
        <li>
          <Link href="/onboarding-requests">
            <a className={route === "/onboarding-requests" ? "selected" : ""}>
              Demandes d&apos;embarquement
            </a>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Navigation
