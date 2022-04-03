import { useSession, signIn, signOut } from "next-auth/react"

const AuthenticatedUser = () => {
  const { data: session } = useSession()

  if (session) {
    return (
      <div className="authenticated-user">
        <div
          className="avatar"
          title={session.user.name}
          style={{ backgroundImage: `url(${session.user.image})` }}
        ></div>
        <div>
          <div>{session.user.name}</div>
          <button className="link text-sm" onClick={() => signOut()}>
            Déconnexion
          </button>
        </div>
      </div>
    )
  }

  return <></>
}

export default AuthenticatedUser
