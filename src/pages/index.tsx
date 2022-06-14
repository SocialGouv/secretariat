import Head from "next/head"
import { useSession } from "next-auth/react"

import Login from "@/components/login"
import Users from "@/components/users"
import Search from "@/components/search"

const Home = () => {
  const { data: session } = useSession()

  return (
    <main>
      <Head>
        <title>Secrétariat</title>
      </Head>
      {session ? (
        <>
          <Search />
          <Users />
        </>
      ) : (
        <Login />
      )}
    </main>
  )
}

export default Home
