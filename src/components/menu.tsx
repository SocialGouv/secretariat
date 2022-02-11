import useGithubUsers from "@/services/github"
import useMatomoUsers from "@/services/matomo"
import useMattermostUsers from "@/services/mattermost"
import useNextCloudUsers from "@/services/nextcloud"
import useOVHUsers from "@/services/ovh"
import useSentryUsers from "@/services/sentry"
import useZammadUsers from "@/services/zammad"
import Link from "next/link"
import { useRouter } from "next/router"

const Menu = () => {
  const {
    query: { slug },
  } = useRouter()

  const ovhUsers = useOVHUsers()
  const githubUsers = useGithubUsers()
  const matomoUsers = useMatomoUsers()
  const sentryUsers = useSentryUsers()
  const zammadUsers = useZammadUsers()
  const nextCloudUsers = useNextCloudUsers()
  const mattermostUsers = useMattermostUsers()

  return (
    <ul className="menu">
      <li className={!slug ? "selected" : ""}>
        <Link href="/">
          <a>
            Users <span>({githubUsers?.length || 0})</span>
          </a>
        </Link>
      </li>
      <li className={slug === "matomo" ? "selected" : ""}>
        <Link href="/service/matomo">
          <a>
            Matomo <span>({matomoUsers?.length || 0})</span>
          </a>
        </Link>
      </li>
      <li className={slug === "sentry" ? "selected" : ""}>
        <Link href="/service/sentry">
          <a>
            Sentry <span>({sentryUsers?.length || 0})</span>
          </a>
        </Link>
      </li>
      <li className={slug === "ovh" ? "selected" : ""}>
        <Link href="/service/ovh">
          <a>
            OVH <span>({ovhUsers?.length || 0})</span>
          </a>
        </Link>
      </li>
      <li className={slug === "zammad" ? "selected" : ""}>
        <Link href="/service/zammad">
          <a>
            Pastek <span>({zammadUsers?.length || 0})</span>
          </a>
        </Link>
      </li>
      <li className={slug === "mattermost" ? "selected" : ""}>
        <Link href="/service/mattermost">
          <a>
            Mattermost <span>({mattermostUsers?.length || 0})</span>
          </a>
        </Link>
      </li>
      <li className={slug === "nextcloud" ? "selected" : ""}>
        <Link href="/service/nextcloud">
          <a>
            NextCloud <span>({nextCloudUsers?.length || 0})</span>
          </a>
        </Link>
      </li>
    </ul>
  )
}

export default Menu
