import { useSession } from "next-auth/react"

import Login from "@/components/login"
import { GithubUsersLoader } from "@/services/github"

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
    <main>
      <h2>Github</h2>
      <br />
      <GithubUsersLoader />
    </main>
  )
}

export default Page
