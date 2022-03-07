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
    all: users_aggregate {
      aggregate {
        count
      }
    }
    github: users_aggregate(distinct_on: github) {
      aggregate {
        count
      }
    }
    matomo: users_aggregate(distinct_on: matomo) {
      aggregate {
        count
      }
    }
    mattermost: users_aggregate(distinct_on: mattermost) {
      aggregate {
        count
      }
    }
    nextcloud: users_aggregate(distinct_on: nextcloud) {
      aggregate {
        count
      }
    }
    ovh: users_aggregate(distinct_on: ovh) {
      aggregate {
        count
      }
    }
    zammad: users_aggregate(distinct_on: zammad) {
      aggregate {
        count
      }
    }
    sentry: users_aggregate(distinct_on: sentry) {
      aggregate {
        count
      }
    }
  }
`

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
