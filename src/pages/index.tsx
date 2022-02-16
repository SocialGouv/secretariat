import { useSession } from "next-auth/react"

import Menu from "@/components/menu"
import Login from "@/components/login"
import AllUsers from "@/components/all-users"

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
        <AllUsers />
      </main>
    </div>
  )
}

export default Page
