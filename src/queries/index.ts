import { gql } from "graphql-request"

export const getUsers = gql`
  query getUsers {
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

export const getUserById = gql`
  query getUserById($id: uuid!) {
    users(where: { id: { _eq: $id } }) {
      id
      ovh
      matomo
      zammad
      github
      sentry
      nextcloud
      mattermost
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

export const updateServices = (serviceName: string) => {
  return gql`
    mutation updateServices($data: jsonb!) {
      update_services(where: {}, _set: { ${serviceName}: $data }) {
        returning {
          id
        }
      }
    }
  `
}

export const getServiceUsers = (serviceName: string) => {
  return gql`
    query getServiceUsers($_contains: jsonb) {
      users(where: { ${serviceName}: { _contains: $_contains } }) {
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
}

export const matchUserInServices = gql`
  query matchUsersInServices($_or: [users_bool_exp!]) {
    users(where: { _or: $_or }) {
      id
      github
      matomo
      zammad
      sentry
      nextcloud
      mattermost
      ovh
    }
  }
`

export const updateUser = gql`
  mutation updateUser($id: uuid!, $_set: users_set_input!) {
    update_users_by_pk(pk_columns: { id: $id }, _set: $_set) {
      id
    }
  }
`

export const addUser = gql`
  mutation AddUser($user: users_insert_input!) {
    insert_users_one(object: $user) {
      id
    }
  }
`

export const deleteUser = gql`
  mutation deleteUser($id: uuid!) {
    delete_users_by_pk(id: $id) {
      id
    }
  }
`
