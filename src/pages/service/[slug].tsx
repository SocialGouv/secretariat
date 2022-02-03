import { useRouter } from "next/router"
import { MatomoUsersLoader } from "@/services/matomo"
import { SentryUsersLoader } from "@/services/sentry"

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
    Component: MatomoUsersLoader,
  },
  mattermost: {
    name: "Mattermost",
    Component: MatomoUsersLoader,
  },
  pastek: {
    name: "pastek",
    Component: MatomoUsersLoader,
  },
  nextcloud: {
    name: "NextCloud",
    Component: MatomoUsersLoader,
  },
} as Services

const Page = () => {
  const { query } = useRouter()
  const slug = Array.isArray(query.slug) ? query.slug[0] : query.slug

  if (slug) {
    const { name, Component } = services[slug]

    return (
      <main>
        <h2>{name}</h2>
        <br />
        <Component />
      </main>
    )
  }

  return <></>
}

export default Page
