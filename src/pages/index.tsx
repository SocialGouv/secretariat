import { useSession } from "next-auth/react"

import { StickyMenu } from "@/components/menu"
import Login from "@/components/login"
import { StickySearch } from "@/components/search"
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
        <StickyMenu />
      </aside>
      <main>
        <StickySearch />
        <AllUsers />
      </main>
    </div>
  )
}

export default Page
