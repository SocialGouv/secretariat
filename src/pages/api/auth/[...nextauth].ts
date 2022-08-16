import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

import { getJwt } from "@/utils/jwt"
import fetcher from "@/utils/fetcher"
import { getUserTeams as getUserTeamsQuery } from "@/queries/index"
import {
  GITHUB_ID,
  GITHUB_SECRET,
  NEXTAUTH_SECRET,
  NODE_ENV,
} from "@/utils/env"

const AuthorizedTeams = ["sre", "ops", "core-team"]

const getUserTeams = async (login: string) => {
  const jwt = getJwt("admin")

  const {
    organization: {
      teams: { nodes: teams },
    },
  } = await fetcher(getUserTeamsQuery, jwt, { login })

  return teams.map((team: GithubTeam) => team.slug)
}

const providers =
  NODE_ENV === "development"
    ? [
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            name: {
              label: "Name",
              type: "text",
              placeholder: "dev",
            },
          },
          async authorize(credentials, req) {
            if (credentials) {
              return { name: credentials.name, image: "/favicon.ico" }
            } else {
              return null
            }
          },
        }),
      ]
    : [
        GithubProvider({
          clientId: GITHUB_ID,
          clientSecret: GITHUB_SECRET,
          profile: (profile) => {
            return {
              teams: [],
              role: "anonymous",
              name: profile.name ?? profile.login,
              login: profile.login,
              email: profile.email as string,
              id: String(profile.id),
              image: profile.avatar_url,
            }
          },
        }),
      ]

export default NextAuth({
  secret: NEXTAUTH_SECRET,
  providers,
  callbacks: {
    async signIn({ user }) {
      if (NODE_ENV === "development") return true

      const { login } = user
      const teams = await getUserTeams(login)
      return AuthorizedTeams.some((team) => teams.includes(team))
    },
    async jwt({ token, user }) {
      if (user) {
        if (NODE_ENV === "development") {
          return {
            ...token,
            name: user.name,
            login: `${user.name}_devEnv`,
            teams: ["dev"],
            role: "user",
          }
        }

        const { login } = user
        const teams = await getUserTeams(login)
        const role = AuthorizedTeams.some((team) => teams.includes(team))
          ? "user"
          : "anonymous"
        return { ...token, login, teams, role }
      }
      return token
    },
    async session({ session, token }) {
      const { user } = session
      const { login, role, teams } = token
      return { ...session, user: { ...user, login, role, teams } }
    },
  },
})
