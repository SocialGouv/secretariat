import jwt from "jsonwebtoken"
import type { SignOptions } from "jsonwebtoken"

export function getJwt(role: string = "user", teams: string[] = []): string {
  const options: SignOptions = {
    algorithm: "RS512",
    expiresIn: "30d",
  }

  const claim = {
    "https://hasura.io/jwt/claims": {
      "x-hasura-default-role": role,
      "x-hasura-allowed-roles": [role],
    },
  }

  const token = jwt.sign(claim, process.env.HASURA_JWT_KEY || "", options)
  return token
}
