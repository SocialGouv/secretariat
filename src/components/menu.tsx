import Link from "next/link"
import { useRouter } from "next/router"

const Menu = () => {
  const {
    query: { slug },
  } = useRouter()

  console.log("SLUG", slug)

  return (
    <ul className="menu">
      <li className={!slug ? "selected" : ""}>
        <Link href="/">
          <a>Users</a>
        </Link>
      </li>
      <li className={slug === "matomo" ? "selected" : ""}>
        <Link href="/service/matomo">
          <a>Matomo</a>
        </Link>
      </li>
      <li className={slug === "sentry" ? "selected" : ""}>
        <Link href="/service/sentry">
          <a>Sentry</a>
        </Link>
      </li>
      <li className={slug === "ovh" ? "selected" : ""}>
        <Link href="/service/ovh">
          <a>OVH</a>
        </Link>
      </li>
      <li className={slug === "zammad" ? "selected" : ""}>
        <Link href="/service/zammad">
          <a>Pastek</a>
        </Link>
      </li>
      <li className={slug === "mattermost" ? "selected" : ""}>
        <Link href="/service/mattermost">
          <a>Mattermost</a>
        </Link>
      </li>
      <li className={slug === "nextcloud" ? "selected" : ""}>
        <Link href="/service/nextcloud">
          <a>NextCloud</a>
        </Link>
      </li>
    </ul>
  )
}

export default Menu
