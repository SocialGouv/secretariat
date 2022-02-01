import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
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
    name: string | unknown
    login: string | unknown
    image: string | unknown
    email: string | unknown
  }
}
