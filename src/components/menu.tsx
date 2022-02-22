import Link from "next/link"
import { useRouter } from "next/router"

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
            Users <span>({counts?.users})</span>
          </a>
        </Link>
      </li>
      <li className={slug === "github" ? "selected" : ""}>
        <Link href="/service/github">
          <a>
            Github <span>({counts?.github})</span>
          </a>
        </Link>
      </li>
      <li className={slug === "matomo" ? "selected" : ""}>
        <Link href="/service/matomo">
          <a>
            Matomo <span>({counts?.matomo})</span>
          </a>
        </Link>
      </li>
      <li className={slug === "sentry" ? "selected" : ""}>
        <Link href="/service/sentry">
          <a>
            Sentry <span>({counts?.sentry})</span>
          </a>
        </Link>
      </li>
      <li className={slug === "ovh" ? "selected" : ""}>
        <Link href="/service/ovh">
          <a>
            OVH <span>({counts?.ovh})</span>
          </a>
        </Link>
      </li>
      <li className={slug === "zammad" ? "selected" : ""}>
        <Link href="/service/zammad">
          <a>
            Pastek <span>({counts?.zammad})</span>
          </a>
        </Link>
      </li>
      <li className={slug === "mattermost" ? "selected" : ""}>
        <Link href="/service/mattermost">
          <a>
            Mattermost <span>({counts?.mattermost})</span>
          </a>
        </Link>
      </li>
      <li className={slug === "nextcloud" ? "selected" : ""}>
        <Link href="/service/nextcloud">
          <a>
            NextCloud <span>({counts?.nextcloud})</span>
          </a>
        </Link>
      </li>
    </ul>
  )
}

export const StickyMenu = () => (
  <div className="sticky-container">
    <Menu />
  </div>
)

export default Menu
