import {
  GITHUB_API_TOKEN,
  MATOMO_API_TOKEN,
  MATTERMOST_API_TOKEN,
  NEXTCLOUD_API_LOGIN,
  NEXTCLOUD_API_SECRET,
  OVH_SERVICE_NAME,
  SENTRY_API_TOKEN,
  ZAMMAD_API_TOKEN,
} from "@/utils/env"
import graphQLFetcher from "@/utils/graphql-fetcher"
import {
  deleteAccount as deleteAccountQuery,
  deleteUsers as deleteUsersQuery,
} from "@/queries/index"
import { getJwt } from "@/utils/jwt"
import statusOk from "@/utils/status-ok"
import ovh from "@/utils/ovh"
import logger from "@/utils/logger"

const deleteAccountOnSuccess = async (status: number, accountID: string) => {
  if (!statusOk(status)) {
    return
  }
  const token = getJwt()
  const {
    delete_services_by_pk: {
      users: {
        services_aggregate: {
          aggregate: { count: userAccountsCount },
        },
        id: userID,
      },
    },
  } = await graphQLFetcher({
    query: deleteAccountQuery,
    token,
    parameters: {
      accountID,
    },
  })
  if (userAccountsCount === 0) {
    await graphQLFetcher({
      query: deleteUsersQuery,
      token,
      parameters: { userIds: [userID] },
    })
  }
}

const revokeGithubAccount = async (username: string, accountID: string) => {
  // Removes a member from the SocialGouv organization with its login
  const response = await fetch(
    `https://api.github.com/orgs/SocialGouv/memberships/${username}`,
    {
      method: "DELETE",
      headers: {
        accept: "application/vnd.github.v3+json",
        authorization: `Bearer ${GITHUB_API_TOKEN}`,
      },
    }
  )
  await deleteAccountOnSuccess(response.status, accountID)
  return { status: response.status, body: await response.text() }
}

const revokeMattermostAccount = async (userID: string, accountID: string) => {
  // Disables a user with its ID
  const response = await fetch(
    `https://mattermost.fabrique.social.gouv.fr/api/v4/users/${userID}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${MATTERMOST_API_TOKEN}`,
      },
    }
  )
  await deleteAccountOnSuccess(response.status, accountID)
  return { status: response.status, body: await response.text() }
}

const revokeMatomoAccount = async (login: string, accountID: string) => {
  // Permanently deletes a user with its login
  const response = await fetch(
    "https://matomo.fabrique.social.gouv.fr/index.php",
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: `module=API&token_auth=${MATOMO_API_TOKEN}&method=UsersManager.deleteUser&userLogin=${login}`,
    }
  )
  await deleteAccountOnSuccess(response.status, accountID)
  return { status: response.status, body: await response.text() }
}

const revokeZammadAccount = async (userID: string, accountID: string) => {
  // Disables a user with its ID
  const response = await fetch(
    `https://pastek.fabrique.social.gouv.fr/api/v1/users/${userID}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${ZAMMAD_API_TOKEN}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({ active: false }),
    }
  )
  await deleteAccountOnSuccess(response.status, accountID)
  return { status: response.status, body: await response.text() }
}

const revokeNextcloudAccount = async (userID: string, accountID: string) => {
  // Disables a user with its ID
  const response = await fetch(
    `https://nextcloud.fabrique.social.gouv.fr/ocs/v1.php/cloud/users/${userID}/disable`,
    {
      method: "PUT",
      headers: {
        "OCS-APIRequest": " true",
        Accept: " application/json",
        Authorization: `Basic ${Buffer.from(
          `${NEXTCLOUD_API_LOGIN}:${NEXTCLOUD_API_SECRET}`
        ).toString("base64")}`,
      },
    }
  )
  await deleteAccountOnSuccess(response.status, accountID)
  return { status: response.status, body: await response.text() }
}

const revokeSentryAccount = async (userID: string, accountID: string) => {
  // TODO is this one permanent ?
  const response = await fetch(
    `https://sentry.fabrique.social.gouv.fr/api/0/organizations/incubateur/members/${userID}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${SENTRY_API_TOKEN}`,
      },
    }
  )
  await deleteAccountOnSuccess(response.status, accountID)
  return { status: response.status, body: await response.text() }
}

const revokeOvhAccount = async (email: string, accountID: string) => {
  // Resets the mail account to random@configureme.me
  const response = await ovh(
    "DELETE",
    `/email/pro/${OVH_SERVICE_NAME}/account/${email}`
  )
  if (response.success) {
    await deleteAccountOnSuccess(200, accountID)
    return { status: 200, body: response.data }
  } else {
    await deleteAccountOnSuccess(500, accountID)
    return {
      status: response.error.error as number,
      body: response.error.message as string,
    }
  }
}

const accountRevokers: Record<ServiceName, AccountRevoker> = {
  github: revokeGithubAccount,
  matomo: revokeMatomoAccount,
  mattermost: revokeMattermostAccount,
  nextcloud: revokeNextcloudAccount,
  ovh: revokeOvhAccount,
  sentry: revokeSentryAccount,
  zammad: revokeZammadAccount,
}

const revoke = async (
  accountServiceID: string,
  accountID: string,
  serviceName: ServiceName
) => {
  logger.info(
    { serviceName, accountID, accountServiceID },
    "started revoking account"
  )
  return accountRevokers[serviceName](accountServiceID, accountID)
}

export default revoke
