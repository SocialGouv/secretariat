import { getUserTeams as getUserTeamsQuery } from "@/queries/index"
import { GITHUB_ID, GITHUB_SECRET, NEXTAUTH_SECRET } from "@/utils/env"
import fetcher from "@/utils/fetcher"
import { getJwt } from "@/utils/jwt"
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

const AuthorizedTeams = ["sre", "ops"]

const getUserTeams = async (login: string) => {
  const jwt = getJwt("admin")

  const {
    organization: {
      teams: { nodes: teams },
    },
  } = await fetcher(getUserTeamsQuery, jwt, { login })

  return teams.map((team: GithubTeam) => team.slug)
}

export default NextAuth({
  secret: NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
      profile: (profile) => {
        return {
          teams: [],
          role: "anonymous",
          name: profile.name,
          login: profile.login,
          email: profile.email,
          id: String(profile.id),
          image: profile.avatar_url,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const { login } = user
      const teams = await getUserTeams(login)
      return teams.includes("sre")
    },
    async jwt({ token, user }) {
      if (user) {
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
