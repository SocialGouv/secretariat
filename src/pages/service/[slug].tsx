import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

import Menu from "@/components/menu"
import Login from "@/components/login"
import { OVHUsersLoader } from "@/services/ovh"
import { MatomoUsersLoader } from "@/services/matomo"
import { SentryUsersLoader } from "@/services/sentry"
import { ZammadUsersLoader } from "@/services/zammad"
import { NextCloudUsersLoader } from "@/services/nextcloud"
import { MattermostUsersLoader } from "@/services/mattermost"

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
    Component: MatomoUsersLoader,
  },
  sentry: {
    name: "Sentry",
    Component: SentryUsersLoader,
  },
  ovh: {
    name: "OVH",
    Component: OVHUsersLoader,
  },
  mattermost: {
    name: "Mattermost",
    Component: MattermostUsersLoader,
  },
  zammad: {
    name: "Pastek",
    Component: ZammadUsersLoader,
  },
  nextcloud: {
    name: "NextCloud",
    Component: NextCloudUsersLoader,
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
