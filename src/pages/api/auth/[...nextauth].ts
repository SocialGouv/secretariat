import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

import { encode, decode, getJwt } from "@/utils/jwt"
import graphQLFetcher from "@/utils/graphql-fetcher"
import { getUserTeams as getUserTeamsQuery } from "@/queries/index"
import {
  GITHUB_ID,
  GITHUB_SECRET,
  NEXTAUTH_SECRET,
  NODE_ENV,
} from "@/utils/env"

const AUTHORIZED_TEAMS = ["sre", "ops", "core-team"]

const getUserTeams = async (login: string) => {
  const {
    organization: {
      teams: { nodes: teams },
    },
  } = await graphQLFetcher({
    query: getUserTeamsQuery,
    token: getJwt(),
    parameters: { login },
  })

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
          async authorize(credentials) {
            if (!credentials) {
              return null
            }

            return {
              id: credentials.name,
              name: credentials.name,
              login: credentials.name,
              image: "/favicon.ico",
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
              id: String(profile.id),
              name: profile.name ?? profile.login,
              login: profile.login,
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

      const teams = await getUserTeams(user.login)
      return AUTHORIZED_TEAMS.some((team) => teams.includes(team))
    },
    async jwt({ token, user }) {
      if (!user) {
        return token
      }

      return { ...token, user }
    },
    async session({ session, token }) {
      return { ...session, ...token }
    },
  },
  jwt: {
    encode,
    decode,
  },
})
