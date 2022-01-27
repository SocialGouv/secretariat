import { SWRConfig } from "swr"
import type { GetStaticProps } from "next"

import { getGitHubUsers, GithubUsersLoader } from "@/services/github"
import { getMatomoUsers, MatomoUsersLoader } from "@/services/matomo"
import { getSentryUsers, SentryUsersLoader } from "@/services/sentry"

export const getStaticProps: GetStaticProps = async () => {
  const githubUsers = await getGitHubUsers()
  const matomoUsers = await getMatomoUsers()
  const sentryUsers = await getSentryUsers()

  return {
    props: {
      fallback: { githubUsers, matomoUsers, sentryUsers },
    },
  }
}

const Page = ({
  fallback,
}: {
  fallback: Record<"users", GithubUser[] | MatomoUser[] | SentryUser[]>
}) => (
  <div className="container">
    <SWRConfig value={{ fallback }}>
      <main>
        <GithubUsersLoader />
        <MatomoUsersLoader />
        <SentryUsersLoader />
      </main>
    </SWRConfig>
  </div>
)

export default Page
