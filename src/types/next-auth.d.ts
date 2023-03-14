import { User } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: User
    "https://hasura.io/jwt/claims": Record<string, unknown>
  }

  interface User {
    id: string
    name: string
    login: string
    image: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: User
  }
}
