import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: number
      role: string
      name: string
      login: string
      email: string
      image: string
      teams: string[]
    }
  }

  interface User {
    id: string
    role: Role
    name: string
    login: string
    email: string
    image: string
    teams: string[]
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
