import { gql } from "graphql-request"
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import fetcher from "@/utils/fetcher"
import { getJwt } from "@/utils/jwt"

const getUserTeamsQuery = gql`
  query getUserTeams($login: String!) {
    organization(login: "socialgouv") {
      teams(first: 100, userLogins: [$login]) {
        nodes {
          slug
        }
      }
    }
  }
`

const getUserTeams = async (login: string) => {
  const token = getJwt()

  const {
    organization: {
      teams: { nodes: teams },
    },
  } = await fetcher(getUserTeamsQuery, token, { login })

  return teams.map((team: GithubTeam) => team.slug)
}

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
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
        const role = teams.includes("sre") ? "user" : "anonymous"
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
