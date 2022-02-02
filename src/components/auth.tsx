import { useSession, signIn, signOut } from "next-auth/react"

const Auth = () => {
  const { data: session } = useSession()

  if (session) {
    return (
      <>
        Signed in as {session?.user?.email} <br />
        User login: {session?.user?.login} <br />
        User teams:
        {session?.user?.teams?.map((team, i) => (
          <div key={i}>{team}</div>
        ))}
        <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}

export default Auth
