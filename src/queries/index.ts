import { gql } from "graphql-request"

export const getGitHubUsers = gql`
  query getGithubUsers {
    services {
      github
    }
  }
`

export const getSentryUsers = gql`
  query getSentryUsers {
    services {
      sentry
    }
  }
`

export const getMatomoUsers = gql`
  query getMatomoUsers {
    services {
      matomo
    }
  }
`

export const getUserTeams = gql`
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
