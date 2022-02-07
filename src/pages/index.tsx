import { useSession } from "next-auth/react"

import Menu from "@/components/menu"
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
    <div className="container">
      <aside>
        <div className="sticky-container">
          <Menu />
        </div>
      </aside>
      <main>
        <GithubUsersLoader />
      </main>
    </div>
  )
}

export default Page
