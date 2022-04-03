import { signIn } from "next-auth/react"

const Login = () => {
  return (
    <div className="login">
      Pour vous connecter, cliquez sur le bouton juste en dessous, là: <br />{" "}
      <br />
      <button className="primary" onClick={() => signIn()}>
        Connexion
      </button>
    </div>
  )
}

export default Login
