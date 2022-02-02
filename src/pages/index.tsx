import Auth from "@/components/auth"
import { GithubUsersLoader } from "@/services/github"
import { MatomoUsersLoader } from "@/services/matomo"
import { SentryUsersLoader } from "@/services/sentry"

const Page = () => {
  return (
    <div className="container">
      <Auth />
      <main>
        <h2>Github</h2>
        <GithubUsersLoader />
        <h2>Matomo</h2>
        <MatomoUsersLoader />
        <h2>Sentry</h2>
        <SentryUsersLoader />
      </main>
    </div>
  )
}

export default Page
