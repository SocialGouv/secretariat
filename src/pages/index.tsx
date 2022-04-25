import Head from "next/head"
import { useSession } from "next-auth/react"

import Login from "@/components/login"
import Users from "@/components/users"
import Search from "@/components/search"
import Loader from "@/components/common/loader"

const Page = () => {
  const { data: session } = useSession()

  return (
    <main>
      <Head>
        <title>Secrétariat</title>
      </Head>
      {session === undefined && <Loader size="lg" />}
      {session === null && <Login />}
      {session && (
        <>
          <Search />
          <Users />
        </>
      )}
    </main>
  )
}

export default Page
