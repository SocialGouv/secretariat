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
  query getGithubUsers($cursor: String) {
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
        edges {
          role
        }
      }
    }
  }
`

export const getRemoteGithubTeams = gql`
  query getRemoteGithubTeams($userLogins: [String!]) {
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
  mutation insertUser($user: users_insert_input = {}) {
    insert_users_one(object: $user) {
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
  mutation deleteServices(
    $existingServicesIds: [uuid!]
    $serviceName: String!
  ) {
    delete_services(
      where: {
        _and: {
          id: { _nin: $existingServicesIds }
          type: { _eq: $serviceName }
        }
      }
    ) {
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
  mutation deleteUsers($userIds: [uuid!] = "") {
    delete_users(where: { id: { _in: $userIds } }) {
      affected_rows
    }
  }
`

export const deleteAccount = gql`
  mutation deleteAccount($accountID: uuid!) {
    delete_services_by_pk(id: $accountID) {
      users {
        services_aggregate {
          aggregate {
            count
          }
        }
        id
      }
    }
  }
`

export const getOnboardingRequests = gql`
  query getOnboardingRequests {
    onboarding_requests(order_by: { created_at: desc }) {
      id
      data
      created_at
      confirmed
      reviewed
    }
  }
`

export const getOnboardingRequest = gql`
  query getOnboardingRequest($id: uuid!) {
    onboarding_requests(where: { id: { _eq: $id }, confirmed: { _eq: true } }) {
      id
      data
      created_at
      confirmed
      reviewed
    }
  }
`

export const getOnboardingRequestContaining = gql`
  query getOnboardingRequestContaining($contains: jsonb!) {
    onboarding_requests(where: { data: { _contains: $contains } }) {
      id
    }
  }
`

export const createOnboardingRequest = gql`
  mutation createOnboardingRequest(
    $request: onboarding_requests_insert_input!
  ) {
    insert_onboarding_requests_one(object: $request) {
      id
    }
  }
`

export const updateOnboardingRequest = gql`
  mutation updateOnboardingRequest(
    $data: onboarding_requests_set_input!
    $cols: onboarding_requests_pk_columns_input!
  ) {
    update_onboarding_requests_by_pk(pk_columns: $cols, _set: $data) {
      id
    }
  }
`

export const confirmOnboardingRequest = gql`
  mutation confirmOnboardingRequest($id: uuid!) {
    update_onboarding_requests(
      where: { id: { _eq: $id }, confirmed: { _eq: false } }
      _set: { confirmed: true }
    ) {
      affected_rows
      returning {
        data
      }
    }
  }
`

export const revokeAction = gql`
  mutation revokeAction(
    $accountID: String!
    $accountServiceID: String!
    $serviceName: String!
  ) {
    revokeAction(
      data: {
        accountID: $accountID
        accountServiceID: $accountServiceID
        serviceName: $serviceName
      }
    ) {
      body
      status
    }
  }
`

export const onboardingRequestAction = gql`
  mutation onboardingRequestAction($data: OnboardingData!) {
    onboardingRequestAction(data: $data) {
      body
      status
    }
  }
`

export const onboardingReviewAction = gql`
  mutation onboardingReviewAction($data: OnboardingData!, $id: String!) {
    onboardingReviewAction(data: $data, id: $id) {
      github {
        body
        status
      }
      mattermost {
        body
        status
      }
      ovh {
        status
        body
      }
    }
  }
`

export const insertLog = gql`
  mutation insertLog($user: String, $action: String!, $parameters: String) {
    insert_logs_one(
      object: { user: $user, action: $action, parameters: $parameters }
    ) {
      id
    }
  }
`

export const getLogs = gql`
  query getLogs {
    logs(order_by: { created_at: desc }) {
      user
      parameters
      id
      created_at
      action
    }
  }
`

export const searchGithubUsers = gql`
  query searchGithubUsers($query: String!) {
    search(query: $query, type: USER, first: 10) {
      nodes {
        ... on User {
          name
          login
          avatarUrl
        }
      }
    }
  }
`
