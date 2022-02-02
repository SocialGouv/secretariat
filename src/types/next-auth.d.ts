import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      teams: string[]
      role: string
      name: string
      login: string
      email: string
      id: number
      image: string
    }
  }

  interface User {
    id: string
    role: Role
    teams: string[]
    name: string
    login: string
    image: string
    email: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role
    login: string
    teams: string[]
    idToken?: string
  }
}
