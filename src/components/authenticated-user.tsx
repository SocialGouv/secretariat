import Image from "next/image"
import { useSession, signOut } from "next-auth/react"

const AuthenticatedUser = () => {
  const { data: session } = useSession()

  if (session) {
    return (
      <div className="authenticated-user">
        <Image
          width={44}
          height={44}
          alt="user avatar"
          src={session.user.image}
        />
        <div className="user-name-links">
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
