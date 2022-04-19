import {
  GITHUB_API_TOKEN,
  MATOMO_API_TOKEN,
  MATTERMOST_API_TOKEN,
  NEXTCLOUD_API_LOGIN,
  NEXTCLOUD_API_SECRET,
  SENTRY_API_TOKEN,
  ZAMMAD_API_TOKEN,
} from "@/utils/env"
import fetcher from "@/utils/rest-fetcher"

export const deleteGithubAccount = async (username: string) => {
  // Removes a member from the SocialGouv organization with its login
  const response = await fetcher(
    `https://api.github.com/orgs/SocialGouv/memberships/${username}`,
    {
      method: "DELETE",
      headers: {
        accept: "application/vnd.github.v3+json",
        authorization: `Bearer ${GITHUB_API_TOKEN}`,
      },
    }
  )
  return response ? response.status : 500
}

export const deleteMattermostAccount = async (userID: string) => {
  // Disables a user with its ID
  const response = await fetcher(
    `https://mattermost.fabrique.social.gouv.fr/api/v4/users/${userID}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${MATTERMOST_API_TOKEN}`,
      },
    }
  )
  return response ? response.status : 500
}

export const deleteMatomoAccount = async (login: string) => {
  // Permanently deletes a user with its login
  const response = await fetcher(
    "https://matomo.fabrique.social.gouv.fr/index.php",
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        module: "API",
        token_auth: MATOMO_API_TOKEN,
        method: "UsersManager.deleteUser",
        userLogin: login,
      }),
    }
  )
  return response ? response.status : 500
}

export const deleteZammadAccount = async (userID: string) => {
  // Disables a user with its ID
  const response = await fetcher(
    `https://pastek.fabrique.social.gouv.fr/api/v1/users/${userID}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${ZAMMAD_API_TOKEN}`,
      },
      body: JSON.stringify({ active: false }),
    }
  )
  return response ? response.status : 500
}

export const deleteNextcloudAccount = async (userID: string) => {
  // Disables a user with its ID
  const response = await fetcher(
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
  return response ? response.status : 500
}

export const deleteSentryAccount = async (userID: string) => {
  // TODO is this one permanent ?
  const response = await fetcher(
    `https://sentry.fabrique.social.gouv.fr/api/0/organizations/incubateur/members/${userID}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${SENTRY_API_TOKEN}`,
      },
    }
  )
  return response ? response.status : 500
}
