import jwt from "jsonwebtoken"
import { JWT, JWTDecodeParams, JWTEncodeParams } from "next-auth/jwt"
import { NEXTAUTH_SECRET } from "./env"

export const getJwt = () => {
  return encode(
    {
      token: {
        user: {
          id: "server",
          name: "server",
          login: "server",
          image: "server",
        },
      },
      secret: "none",
    },
    "admin"
  )
}

export const decode = ({ token: raw }: JWTDecodeParams): JWT => {
  if (!raw) throw Error("NextAuth - no token received in decode function")

  return jwt.verify(raw, NEXTAUTH_SECRET, {
    algorithms: ["RS512"],
  }) as JWT
}

export const encode = (
  { token: payload }: JWTEncodeParams,
  hasuraRole = "user"
): string => {
  if (!payload) throw Error("NextAuth - no token received in encode function")
  return jwt.sign(
    {
      "https://hasura.io/jwt/claims": {
        "x-hasura-allowed-roles": [hasuraRole],
        "x-hasura-default-role": hasuraRole,
        "x-hasura-role": hasuraRole,
      },
      user: payload.user,
      state: payload.state,
    },
    NEXTAUTH_SECRET,
    { algorithm: "RS512", expiresIn: "7d" }
  )
}
