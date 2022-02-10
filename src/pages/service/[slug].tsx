import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

import Menu from "@/components/menu"
import Login from "@/components/login"
import OVHUsers from "@/components/ovh-users"
import MatomoUsers from "@/components/matomo-users"
import SentryUsers from "@/components/sentry-users"
import ZammadUsers from "@/components/zammad-users"
import NextCloudUsers from "@/components/nextcloud-users"
import MattermostUsers from "@/components/mattermost-users"

interface Services {
  [key: string]: Service
}

interface Service {
  name: string
  Component: () => JSX.Element
}

const services = {
  matomo: {
    name: "Matomo",
    Component: MatomoUsers,
  },
  sentry: {
    name: "Sentry",
    Component: SentryUsers,
  },
  ovh: {
    name: "OVH",
    Component: OVHUsers,
  },
  zammad: {
    name: "Pastek",
    Component: ZammadUsers,
  },
  mattermost: {
    name: "Mattermost",
    Component: MattermostUsers,
  },
  nextcloud: {
    name: "NextCloud",
    Component: NextCloudUsers,
  },
} as Services

const Page = () => {
  const { query } = useRouter()
  const { data: session } = useSession()
  const slug = Array.isArray(query.slug) ? query.slug[0] : query.slug

  if (!session) {
    return (
      <div className="container">
        <main>
          <Login />
        </main>
      </div>
    )
  } else if (slug) {
    const { name, Component } = services[slug]

    return (
      <div className="container">
        <aside>
          <div className="sticky-container">
            <Menu />
          </div>
        </aside>
        <main>
          <Component />
        </main>
      </div>
    )
  }

  return <></>
}

export default Page
