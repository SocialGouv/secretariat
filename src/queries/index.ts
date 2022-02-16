import { gql } from "graphql-request"

export const getUsers = gql`
  query MyQuery {
    users {
      id
      github
      matomo
      mattermost
      nextcloud
      ovh
      sentry
      zammad
    }
  }
`

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

export const getRemoteGithubUsers = gql`
  query GetGithubUsers($cursor: String) {
    organization(login: "SocialGouv") {
      membersWithRole(first: 100, after: $cursor) {
        nodes {
          id
          name
          email
          login
          avatarUrl
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`

export const getRemoteGithubTeams = gql`
  query GetRemoteGithubTeams($userLogins: [String!]) {
    organization(login: "SocialGouv") {
      teams(userLogins: $userLogins, first: 100) {
        nodes {
          id
          name
          slug
        }
      }
    }
  }
`

export const getServicesCount = gql`
  query getServicesCount {
    services_count {
      users
      github
      matomo
      mattermost
      nextcloud
      ovh
      sentry
      zammad
    }
  }
`
