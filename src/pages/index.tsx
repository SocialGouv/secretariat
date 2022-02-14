import { useSession } from "next-auth/react"

import Menu from "@/components/menu"
import Login from "@/components/login"
import GithubUsers from "@/components/github-users"

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
      <div>pof</div>
      <aside>
        <div className="sticky-container">
          <Menu />
        </div>
      </aside>
      <main>
        <GithubUsers />
      </main>
    </div>
  )
}

export default Page
