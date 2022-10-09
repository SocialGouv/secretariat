import Head from "next/head"
import { useSession } from "next-auth/react"

import Login from "@/components/login"
import LogsList from "@/components/logs-list"

const Logs = () => {
  const { data: session } = useSession()

  return (
    <main className="mt-10">
      <Head>
        <title>Secrétariat</title>
      </Head>
      {session ? (
        <>
          <LogsList />
        </>
      ) : (
        <Login />
      )}
    </main>
  )
}

export default Logs
