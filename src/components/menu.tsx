import Link from "next/link"

const Menu = () => (
  <ul className="menu">
    <li>
      <Link href="/">
        <a>Users</a>
      </Link>
    </li>
    <li>
      <Link href="/service/matomo">
        <a>Matomo</a>
      </Link>
    </li>
    <li>
      <Link href="/service/sentry">
        <a>Sentry</a>
      </Link>
    </li>
    <li>
      <Link href="/service/ovh">
        <a>OVH</a>
      </Link>
    </li>
    <li>
      <Link href="/service/zammad">
        <a>Pastek</a>
      </Link>
    </li>
    <li>
      <Link href="/service/mattermost">
        <a>Mattermost</a>
      </Link>
    </li>
    <li>
      <Link href="/service/nextCloud">
        <a>NextCloud</a>
      </Link>
    </li>
  </ul>
)

export default Menu
