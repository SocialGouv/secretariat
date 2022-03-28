import { useSession } from "next-auth/react"

import Login from "@/components/login"
import Users from "@/components/users"
import Search from "@/components/search"

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
      <main>
        <Search />
        <Users />
      </main>
    </div>
  )
}

export default Page
