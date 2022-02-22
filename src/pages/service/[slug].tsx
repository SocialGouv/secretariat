import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

import Login from "@/components/login"
import Users from "@/components/users/index"
import { StickyMenu } from "@/components/menu"
import useServiceUsers from "@/services/service-users"

type Service =
  | "matomo"
  | "sentry"
  | "github"
  | "nextcloud"
  | "zammad"
  | "ovh"
  | "mattermost"

const Page = () => {
  const { query } = useRouter()
  const { data: session } = useSession()
  const slug = Array.isArray(query.slug) ? query.slug[0] : query.slug
  const users = useServiceUsers(slug as Service)

  if (!session) {
    return (
      <div className="container">
        <main>
          <Login />
        </main>
      </div>
    )
  } else if (slug) {
    return (
      <div className="container">
        <aside>
          <StickyMenu />
        </aside>
        <main>
          <Users users={users}></Users>
        </main>
      </div>
    )
  }

  return <></>
}

export default Page
