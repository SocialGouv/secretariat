import { SWRConfig } from "swr"
import type { GetStaticProps } from "next"

import { getGitHubUsers, UsersLoader } from "@/utils/helpers"

export const getStaticProps: GetStaticProps = async () => {
  const users = await getGitHubUsers()

  return {
    props: {
      fallback: { users },
    },
  }
}

const Page = ({
  fallback,
}: {
  fallback: Record<"users" | "posts", User[]>
}) => (
  <div className="container">
    <SWRConfig value={{ fallback }}>
      <main>
        <UsersLoader />
      </main>
    </SWRConfig>
  </div>
)

export default Page
