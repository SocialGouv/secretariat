import { gql } from "graphql-request"
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

const getUserTeams = gql`
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

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile: (profile) => ({
        teams: [],
        role: "anonymous",
        name: profile.name,
        login: profile.login,
        email: profile.email,
        id: String(profile.id),
        image: profile.avatar_url,
      }),
    }),
    // ...add more providers here
  ],
  callbacks: {
    async session({ session, token, user }) {
      console.log("SESSION")
      console.log("session", session)
      console.log("token", token)
      console.log("user", user)

      session.user.role = token.role as string
      session.user.login = token.login as string
      session.user.teams = token.teams as string[]
      return session

      // Send properties to the client, like an access_token from a provider.
      // session.accessToken = token.accessToken
      // return session
    },
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      console.log("JWT")
      console.log("token", token)
      console.log("account", account)

      if (account) {
        // token.accessToken = account.access_token
        token.login = account.login
      }
      return token
    },
  },
})
