import { useSession } from "next-auth/react"

import Login from "@/components/login"
import { GithubUsersLoader } from "@/services/github"
import { MatomoUsersLoader } from "@/services/matomo"
import { SentryUsersLoader } from "@/services/sentry"

const Page = () => {
  const { data: session } = useSession()

  if (!session) {
    return (
      <div className="container">
        <main>
          <Login />
        </main>
      </div>
    )
  }

  return (
    <div className="container">
      <main>
        <h2>Github</h2>
        <GithubUsersLoader />
        <br />
        <h2>Matomo</h2>
        <MatomoUsersLoader />
        <br />
        <h2>Sentry</h2>
        <SentryUsersLoader />
      </main>
    </div>
  )
}

export default Page
