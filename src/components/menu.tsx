import Link from "next/link"
import { useRouter } from "next/router"

import SERVICES from "@/utils/SERVICES"
import useServicesCount from "@/services/services-count"

const Menu = () => {
  const {
    query: { slug },
  } = useRouter()

  const counts = useServicesCount()

  return (
    <ul className="menu">
      <li className={!slug ? "selected" : ""}>
        <Link href="/">
          <a>
            Utilisateurs <span>({counts ? counts.all : 0})</span>
          </a>
        </Link>
      </li>
      {SERVICES.map((service, i) => (
        <li key={i} className={slug === service ? "selected" : ""}>
          <Link href={`/service/${service}`}>
            <a>
              {service} <span>({counts ? counts[service] : 0})</span>
            </a>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export const StickyMenu = () => (
  <div className="sticky-container">
    <Menu />
  </div>
)

export default Menu
