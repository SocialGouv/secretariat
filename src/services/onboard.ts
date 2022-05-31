import pReduce from "p-reduce"

import ovh from "@/utils/ovh"
import SERVICES from "@/utils/SERVICES"
import strongPassword from "@/utils/strong-password"
import {
  GITHUB_API_TOKEN,
  MATTERMOST_API_TOKEN,
  OVH_SERVICE_NAME,
} from "@/utils/env"

// const githubAccountCreator = async ({
//   login,
// }: GithubOnboardingData): Promise<APIResponse> => {
const githubAccountCreator = async ({
  githubLogin,
}: OnboardingData): Promise<APIResponse> => {
  const responseID = await fetch(
    `https://api.github.com/users/${githubLogin}`,
    {
      headers: { accept: "application/vnd.github.v3+json" },
    }
  )
  const { id: userID } = await responseID.json()

  const response = await fetch(
    `https://api.github.com/orgs/SocialGouv/invitations`,
    {
      method: "POST",
      headers: {
        accept: "application/vnd.github.v3+json",
        authorization: `Bearer ${GITHUB_API_TOKEN}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ invitee_id: userID }),
    }
  )
  return { status: response.status, body: await response.json() }
}

const mattermostAccountCreator = async ({
  firstName,
  lastName,
  email,
}: OnboardingData): Promise<APIResponse> => {
  const username = `${firstName.replace(/\s+/g, "-").toLowerCase()}.${lastName
    .replace(/\s+/g, "-")
    .toLowerCase()}`
  const response = await fetch(
    "https://mattermost.fabrique.social.gouv.fr/api/v4/users",
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${MATTERMOST_API_TOKEN}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        username,
        last_name: lastName,
        first_name: firstName,
        password: strongPassword(),
      }),
    }
  )
  return { status: response.status, body: await response.json() }
}

const ovhAccountCreator = async ({ firstName, lastName }: OnboardingData) => {
  const mailResponse = await ovh(
    "GET",
    `/email/pro/${OVH_SERVICE_NAME}/account`
  )
  if (!mailResponse.success)
    return {
      status: mailResponse.error.error,
      body: mailResponse.error.message,
    }
  const email = mailResponse.data.find((email: string) =>
    email.endsWith("@configureme.me")
  )
  const response = await ovh(
    "PUT",
    `/email/pro/${OVH_SERVICE_NAME}/account/${email}`,
    {
      domain: "fabrique.social.gouv.fr",
      login: `${firstName}.${lastName}`,
      displayName: `${firstName} ${lastName}`,
    }
  )
  return response.success
    ? { status: 200, body: response.data ? response.data : "" }
    : { status: response.error.error, body: response.error.message }
}

const accountCreators: Record<string, any> = {
  github: githubAccountCreator,
  mattermost: mattermostAccountCreator,
  ovh: ovhAccountCreator,
}

const onboard = async ({ services, ...user }: OnboardingData) =>
  // Create required accounts
  pReduce(
    [
      ...SERVICES.filter(
        (serviceName) => serviceName in services && services[serviceName]
      ),
      "github",
    ],
    async (acc, serviceName) => ({
      ...acc,
      [serviceName]: await accountCreators[serviceName](user),
    }),
    {}
  )

export default onboard
