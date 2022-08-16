import jwt from "jsonwebtoken"

import type { SignOptions } from "jsonwebtoken"

import { HASURA_JWT_KEY } from "./env"

export function getJwt(role: string = "anonymous"): string {
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

  return jwt.sign(claim, HASURA_JWT_KEY, options)
}
