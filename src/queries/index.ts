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

export const getOVHUsers = gql`
  query getOVHUsers {
    services {
      ovh
    }
  }
`

export const getZammadUsers = gql`
  query getZammadUsers {
    services {
      zammad
    }
  }
`

export const getMattermostUsers = gql`
  query getMattermostUsers {
    services {
      mattermost
    }
  }
`

export const getNextCloudUsers = gql`
  query getNextCloudUsers {
    services {
      nextcloud
    }
  }
`

export const getOVHCUsers = gql`
  query getOVHUsers {
    services {
      nextcloud
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
