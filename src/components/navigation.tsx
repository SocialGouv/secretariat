import Link from "next/link"

const Navigation = () => (
  <div className="navigation">
    <ul>
      <li>
        <Link href="/accounts">
          <a className="selected">Gestion des comptes</a>
        </Link>
      </li>
      <li>
        <Link href="/onboarding-requests">
          <a>Demandes d&apos;embarquement</a>
        </Link>
      </li>
    </ul>
  </div>
)

export default Navigation
