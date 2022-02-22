import { useSession } from "next-auth/react"

import Login from "@/components/login"
import Users from "@/components/users/index"
import { StickyMenu } from "@/components/menu"
import { usePagedUsers } from "@/services/users"
import { StickySearch } from "@/components/search"

const Page = () => {
  const { data: session } = useSession()
  const users = usePagedUsers()

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
        <Users users={users}></Users>
      </main>
    </div>
  )
}

export default Page
