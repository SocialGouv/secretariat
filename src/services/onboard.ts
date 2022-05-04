import { GITHUB_API_TOKEN } from "@/utils/env"
import SERVICES from "@/utils/SERVICES"
import pReduce from "p-reduce"

const githubAccountCreator = async ({ login }: GithubOnboardingData) => {
  const responseID = await fetch(`https://api.github.com/users/${login}`, {
    headers: { accept: "application/vnd.github.v3+json" },
  })
  const userID = (await responseID.json()).id

  const response = await fetch(
    `https://api.github.com/orgs/SocialGouv/invitations`,
    {
      method: "POST",
      headers: {
        accept: "application/vnd.github.v3+json",
        authorization: `Bearer ${GITHUB_API_TOKEN}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({ invitee_id: userID }),
    }
  )
  return { status: response.status, body: await response.json() }
}

const matomoAccountCreator = (data: MatomoOnboardingData) => {
  return { status: 501, body: "not implemented yet" }
}

const mattermostAccountCreator = (data: MattermostOnboardingData) => {
  return { status: 501, body: "not implemented yet" }
}

const nextcloudAccountCreator = (data: NextcloudOnboardingData) => {
  return { status: 501, body: "not implemented yet" }
}

const ovhAccountCreator = (data: OvhOnboardingData) => {
  return { status: 501, body: "not implemented yet" }
}

const sentryAccountCreator = (data: SentryOnboardingData) => {
  return { status: 501, body: "not implemented yet" }
}

const zammadAccountCreator = (data: ZammadOnboardingData) => {
  return { status: 501, body: "not implemented yet" }
}

const accountCreators: Record<ServiceName, any> = {
  github: githubAccountCreator,
  matomo: matomoAccountCreator,
  mattermost: mattermostAccountCreator,
  nextcloud: nextcloudAccountCreator,
  ovh: ovhAccountCreator,
  sentry: sentryAccountCreator,
  zammad: zammadAccountCreator,
}

export const onboard = async ({
  firstname,
  lastname,
  arrivalDate,
  departureDate,
  ...accounts
}: OnboardingData) => {
  return pReduce(
    SERVICES.filter((serviceName) => serviceName in accounts),
    async (acc, serviceName) => ({
      ...acc,
      [serviceName]: await accountCreators[serviceName](accounts[serviceName]),
    }),
    {}
  )
}
