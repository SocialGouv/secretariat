import {
  GITHUB_API_TOKEN,
  MATTERMOST_API_TOKEN,
  OVH_SERVICE_NAME,
} from "@/utils/env"
// import graphQLFetcher from "@/utils/graphql-fetcher"
import graphQLServiceFetcher from "@/utils/graphql-service-fetcher"
import { getJwt } from "@/utils/jwt"
import logger from "@/utils/logger"
import ovh from "@/utils/ovh"
import SERVICES from "@/utils/SERVICES"
import sluggifyString from "@/utils/sluggify-string"
import statusOk from "@/utils/status-ok"
import strongPassword from "@/utils/strong-password"
import pReduce from "p-reduce"
import { insertService, insertUser } from "../queries"

const ACCOUNTS_TO_CREATE_ON_SUCCESS = ["ovh", "mattermost"]

const githubAccountCreator = async ({
  githubLogin,
}: OnboardingDataPerService): Promise<APIResponse> => {
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
}: OnboardingDataPerService): Promise<APIResponse> => {
  const username = `${sluggifyString(firstName)}.${sluggifyString(lastName)}`
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
  const body = await response.json()

  if (response.status === 201 && body.id) {
    const teamResponse = await fetch(
      "https://mattermost.fabrique.social.gouv.fr/api/v4/teams/k4iacfzt8jnxbnxemzz77s344w/members",
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${MATTERMOST_API_TOKEN}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          user_id: body.id,
          team_id: "k4iacfzt8jnxbnxemzz77s344w",
        }),
      }
    )
    if (!statusOk(teamResponse.status)) {
      logger.error(
        { status: teamResponse.status, body: teamResponse.json() },
        "Error when adding Mattermost user to SocialGouv team"
      )
    }
  } else {
    logger.error(
      { status: response.status, body },
      "Error when creating Mattermost user"
    )
  }
  return { status: response.status, body }
}

const ovhAccountCreator = async ({
  firstName,
  lastName,
}: OnboardingDataPerService) => {
  let response = await ovh(
    "GET",
    `/email/exchange/${OVH_SERVICE_NAME}/service/${OVH_SERVICE_NAME}/account`
  )
  if (!response.success)
    return {
      status: response.error.error,
      body: response.error.message,
    }
  let email = (response.data as string[]).find((email: string) =>
    email.endsWith("@configureme.me")
  )
  if (!email) {
    return {
      status: 503,
      body: "Could not get an available configureme.me OVH email",
    }
  }
  const login = `${sluggifyString(firstName)}.${sluggifyString(lastName)}`
  response = await ovh(
    "PUT",
    `/email/exchange/${OVH_SERVICE_NAME}/service/${OVH_SERVICE_NAME}/account/${email}`,
    {
      login,
      domain: "fabrique.social.gouv.fr",
      displayName: `${firstName} ${lastName}`,
    }
  )

  if (!response.success) {
    return {
      status: response.error.error,
      body: response.error.message,
      mailInfo: { login },
    }
  }

  email = `${login}@fabrique.social.gouv.fr`
  const password = strongPassword()
  response = await ovh(
    "POST",
    `/email/exchange/${OVH_SERVICE_NAME}/service/${OVH_SERVICE_NAME}/account/${email}/changePassword`,
    { password }
  )

  if (!response.success) {
    return {
      status: response.error.error,
      body: response.error.message,
      mailInfo: { login },
    }
  }

  // Fetch account data
  const accountResponse = await ovh(
    "GET",
    `/email/exchange/${OVH_SERVICE_NAME}/service/${OVH_SERVICE_NAME}/account/${email}`
  )

  return {
    status: 200,
    body: accountResponse.data,
    mailInfo: { login, password },
  }
}

const redactServicesCreationResponses = (
  servicesCreationResponses: OnboardingResponses
) => {
  if (servicesCreationResponses.ovh) {
    return {
      ...servicesCreationResponses,
      // Remove mailInfo key
      ovh: {
        status: servicesCreationResponses.ovh.status,
        body: servicesCreationResponses.ovh.body,
      },
    }
  }
  return servicesCreationResponses
}

const accountCreators = {
  github: githubAccountCreator,
  mattermost: mattermostAccountCreator,
  ovh: ovhAccountCreator,
}

const shouldInsertAccount = (serviceName: string, response: APIResponse) =>
  statusOk(response.status) &&
  ACCOUNTS_TO_CREATE_ON_SUCCESS.includes(serviceName)

const createAccountsOnSuccess = async (
  {
    departure,
    arrival,
    email,
  }: {
    arrival: string
    departure: string
    email: string
  },
  onboardingRequestId: string,
  responses: Record<string, APIResponse>
) => {
  if (
    Object.entries(responses).some(([serviceName, response]) =>
      shouldInsertAccount(serviceName, response)
    )
  ) {
    const token = getJwt()

    // First, create an associated user entry
    const {
      insert_users_one: { id: userId },
    } = await graphQLServiceFetcher({
      query: insertUser,
      token,
      parameters: {
        user: {
          arrival,
          departure,
          email,
          onboarding_request_id: onboardingRequestId,
        },
      },
    })

    for (const [serviceName, response] of Object.entries(responses)) {
      if (shouldInsertAccount(serviceName, response)) {
        await graphQLServiceFetcher({
          query: insertService,
          token,
          parameters: {
            service: {
              data: responses[serviceName].body,
              user_id: userId,
              type: serviceName,
            },
          },
        })
      }
    }
  }
}

const onboard = async (
  { services, ...user }: OnboardingData,
  onboardingRequestId: string
): Promise<OnboardingResponses> => {
  const servicesToCreate = [
    ...SERVICES.filter(
      (serviceName) => serviceName in services && services[serviceName] === true
    ),
    ...(user.githubLogin !== ""
      ? ["github" as keyof ServiceAccountsMapping]
      : []),
  ]

  logger.info({ servicesToCreate, user }, "started onboarding user")

  if (servicesToCreate.length === 0) {
    return {}
  }
  // Create required accounts
  const servicesCreationResponses = await pReduce(
    servicesToCreate,
    async (acc, serviceName) => ({
      ...acc,
      [serviceName]: await accountCreators[
        serviceName as "ovh" | "mattermost" | "github"
      ](user),
    }),
    {}
  )

  await createAccountsOnSuccess(
    user,
    onboardingRequestId,
    servicesCreationResponses
  )

  logger.info(
    {
      servicesToCreate,
      user,
      servicesCreationResponses: redactServicesCreationResponses(
        servicesCreationResponses
      ),
    },
    "finished onboarding user"
  )

  return servicesCreationResponses
}

export default onboard
