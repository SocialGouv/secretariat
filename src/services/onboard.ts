import {
  GITHUB_API_TOKEN,
  MATTERMOST_API_TOKEN,
  OVH_SERVICE_NAME,
} from "@/utils/env"
import SERVICES from "@/utils/SERVICES"
import pReduce from "p-reduce"
import strongPassword from "@/utils/strong-password"
import ovh from "@/utils/ovh"

const githubAccountCreator = async ({
  login,
}: GithubOnboardingData): Promise<APIResponse> => {
  const responseID = await fetch(`https://api.github.com/users/${login}`, {
    headers: { accept: "application/vnd.github.v3+json" },
  })
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
  firstname,
  lastname,
  email,
}: MattermostOnboardingData): Promise<APIResponse> => {
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
        first_name: firstname,
        last_name: lastname,
        username: `${firstname}.${lastname}`,
        password: strongPassword(),
      }),
    }
  )
  return { status: response.status, body: await response.json() }
}

const ovhAccountCreator = async ({ login }: OvhOnboardingData) => {
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
      displayName: login,
      login,
      domain: "fabrique.social.gouv.fr",
    }
  )
  return response.success
    ? { status: 200, body: response.data }
    : { status: response.error.error, body: response.error.message }
}

const accountCreators: Record<string, any> = {
  github: githubAccountCreator,
  mattermost: mattermostAccountCreator,
  ovh: ovhAccountCreator,
}

const onboard = async ({ services, ...user }: OnboardingData) => {
  // Create required accounts and insert accounts in DB on success
  const servicesCreationResponses = await pReduce(
    SERVICES.filter((serviceName) => serviceName in services),
    async (acc, serviceName) => ({
      ...acc,
      [serviceName]: await accountCreators[serviceName]({
        ...user,
        ...services[serviceName],
      }),
    }),
    {}
  )
  return servicesCreationResponses
}

export default onboard
