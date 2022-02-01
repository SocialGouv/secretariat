import { SWRConfig } from "swr"
import type { GetStaticProps } from "next"

import { getGitHubUsers, GithubUsersLoader } from "@/services/github"
import { getMatomoUsers, MatomoUsersLoader } from "@/services/matomo"
import { getSentryUsers, SentryUsersLoader } from "@/services/sentry"
import Auth from "@/components/auth"

import { useSession, signIn, signOut } from "next-auth/react"

// export const getStaticProps: GetStaticProps = async () => {
//   const githubUsers = await getGitHubUsers()
//   const matomoUsers = await getMatomoUsers()
//   const sentryUsers = await getSentryUsers()

//   return {
//     props: {
//       fallback: { githubUsers, matomoUsers, sentryUsers },
//     },
//   }
// }

const Page = ({
  fallback,
}: {
  fallback: Record<"users", GithubUser[] | MatomoUser[] | SentryUser[]>
}) => {
  const { data: session } = useSession()

  return (
    <div className="container">
      <Auth />
      {/* <SWRConfig value={{ fallback }}> */}
      {/* {session && ( */}
      <main>
        <GithubUsersLoader />
        <MatomoUsersLoader />
        <SentryUsersLoader />
      </main>
      {/* )} */}
      {/* </SWRConfig> */}
    </div>
  )
}

export default Page
