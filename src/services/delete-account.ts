import {
  GITHUB_API_TOKEN,
  MATOMO_API_TOKEN,
  MATTERMOST_API_TOKEN,
  NEXTCLOUD_API_LOGIN,
  NEXTCLOUD_API_SECRET,
  OVH_APP_KEY,
  OVH_APP_SECRET,
  OVH_CONSUMER_KEY,
  OVH_SERVICE_NAME,
  SENTRY_API_TOKEN,
  ZAMMAD_API_TOKEN,
} from "@/utils/env"

export const deleteGithubAccount = async (username: string) => {
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
  return { status: response.status, body: await response.text() }
}

export const deleteMattermostAccount = async (userID: string) => {
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
  return { status: response.status, body: await response.text() }
}

export const deleteMatomoAccount = async (login: string) => {
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
  return { status: response.status, body: await response.text() }
}

export const deleteZammadAccount = async (userID: string) => {
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
  return { status: response.status, body: await response.text() }
}

export const deleteNextcloudAccount = async (userID: string) => {
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
  return { status: response.status, body: await response.text() }
}

export const deleteSentryAccount = async (userID: string) => {
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
  return { status: response.status, body: await response.text() }
}

export const deleteOvhAccount = async (email: string) => {
  // Permanently deletes a user with its email
  const ovh = require("ovh")({
    endpoint: "ovh-eu",
    appKey: OVH_APP_KEY,
    appSecret: OVH_APP_SECRET,
    consumerKey: OVH_CONSUMER_KEY,
  })

  try {
    await ovh.requestPromised(
      "DELETE",
      `/email/pro/${OVH_SERVICE_NAME}/account/${email}`
    )
    return { status: 200, body: "" }
  } catch (error: any) {
    return { status: error.error, body: error.message }
  }
}