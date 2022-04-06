import { gql } from "graphql-request"

const userFragment = gql`
  fragment userFields on users {
    id
    departure
    arrival
    updated_at
    services {
      id
      data
      type
    }
  }
`

export const mergeUsers = gql`
  mutation updateServicesUser($userToKeepId: uuid!, $userToDropId: uuid!) {
    updatedRows: update_services(
      where: { user_id: { _eq: $userToDropId } }
      _set: { user_id: $userToKeepId }
    ) {
      affected_rows
    }
    deletedUser: delete_users_by_pk(id: $userToDropId) {
      id
    }
  }
`

const userServicesFragment = gql`
  fragment userServicesFields on users {
    id
    ovh
    github
    matomo
    sentry
    zammad
    nextcloud
    mattermost
  }
`

export const getUsers = gql`
  query getUsers {
    users {
      ...userFields
    }
  }
  ${userFragment}
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

export const updateUser = gql`
  mutation updateUser($id: uuid!, $_set: users_set_input!) {
    update_users_by_pk(pk_columns: { id: $id }, _set: $_set) {
      id
    }
  }
`

export const getServicesMatchingId = gql`
  query getServicesMatchingId($idKeyValue: jsonb!, $serviceName: String!) {
    services(
      where: { data: { _contains: $idKeyValue }, type: { _eq: $serviceName } }
    ) {
      id
    }
  }
`

export const insertUser = gql`
  mutation insertUser {
    insert_users_one(object: {}) {
      id
    }
  }
`

export const insertService = gql`
  mutation insertService($service: services_insert_input!) {
    insert_services_one(object: $service) {
      id
    }
  }
`

export const updateService = gql`
  mutation updateService($serviceId: uuid!, $service: services_set_input!) {
    update_services_by_pk(pk_columns: { id: $serviceId }, _set: $service) {
      id
    }
  }
`

export const deleteServices = gql`
  mutation deleteServices($existingServicesIds: [uuid!]) {
    delete_services(where: { id: { _nin: $existingServicesIds } }) {
      returning {
        users {
          id
          services_aggregate {
            aggregate {
              count
            }
          }
        }
      }
    }
  }
`

export const deleteUsers = gql`
  mutation deleteServices($userIds: [uuid!] = "") {
    delete_users(where: { id: { _in: $userIds } }) {
      affected_rows
    }
  }
`
