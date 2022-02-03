import { useSession, signIn, signOut } from "next-auth/react"

const AuthenticatedUser = () => {
  const { data: session } = useSession()

  if (session) {
    return (
      <div className="authenticated-user">
        <div
          title={session.user.name}
          className="w-8 h-8 bg-cover rounded shadow"
          style={{ backgroundImage: `url(${session.user.image})` }}
        ></div>
        <div>
          <div>{session.user.name}</div>
          <button className="link text-xs" onClick={() => signOut()}>
            Déconnexion
          </button>
        </div>
      </div>
    )
  }

  return <></>
}

export default AuthenticatedUser
