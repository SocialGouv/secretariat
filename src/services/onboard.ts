import {
  GITHUB_API_TOKEN,
  MATTERMOST_API_TOKEN,
  OVH_SERVICE_NAME,
} from "@/utils/env"
import SERVICES from "@/utils/SERVICES"
import pReduce from "p-reduce"
import strongPassword from "@/utils/strong-password"
import ovh from "@/utils/ovh"
import statusOk from "@/utils/status-ok"
import fetcher from "@/utils/fetcher"
import { insertService, insertUser } from "../queries"
import { getJwt } from "@/utils/jwt"

const ACCOUNTS_TO_CREATE_ON_SUCCESS = ["ovh", "mattermost"]

const githubAccountCreator = async ({
  login,
}: {
  login: string
}): Promise<APIResponse> => {
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
}: {
  firstname: string
  lastname: string
  email: string
}): Promise<APIResponse> => {
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

const ovhAccountCreator = async ({
  firstname,
  lastname,
}: {
  firstname: string
  lastname: string
}) => {
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
  const login = `${firstname}.${lastname}`
  const response = await ovh(
    "PUT",
    `/email/pro/${OVH_SERVICE_NAME}/account/${email}`,
    {
      displayName: login,
      login,
      domain: "fabrique.social.gouv.fr",
    }
  )

  // Fetch account data
  const accountResponse = await ovh(
    "GET",
    `/email/pro/${OVH_SERVICE_NAME}/account/${login}@fabrique.social.gouv.fr`
  )

  return response.success
    ? {
        status: 200,
        body: accountResponse.success
          ? accountResponse.data
          : accountResponse.error,
      }
    : { status: response.error.error, body: response.error.message }
}

const accountCreators: Record<string, any> = {
  github: githubAccountCreator,
  mattermost: mattermostAccountCreator,
  ovh: ovhAccountCreator,
}

const shouldInsertAccount = (serviceName: string, response: APIResponse) =>
  statusOk(response.status) &&
  ACCOUNTS_TO_CREATE_ON_SUCCESS.includes(serviceName)

const createAccountsOnSuccess = async (
  {
    departureDate: departure,
    arrivalDate: arrival,
  }: { arrivalDate: Date; departureDate: Date },
  responses: Record<string, APIResponse>
) => {
  if (
    Object.entries(responses).some(([serviceName, response]) =>
      shouldInsertAccount(serviceName, response)
    )
  ) {
    const jwt = getJwt("webhook")

    // First, create an associated user entry
    const {
      insert_users_one: { id: userId },
    } = await fetcher(insertUser, jwt, { user: { arrival, departure } })

    for (const [serviceName, response] of Object.entries(responses)) {
      if (shouldInsertAccount(serviceName, response)) {
        await fetcher(insertService, jwt, {
          service: {
            data: responses[serviceName].body,
            user_id: userId,
            type: serviceName,
          },
        })
      }
    }
  }
}

const onboard = async ({ services, ...user }: OnboardingData) => {
  // Create required accounts
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

  await createAccountsOnSuccess(user, servicesCreationResponses)

  return servicesCreationResponses
}

export default onboard
