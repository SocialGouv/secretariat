import {
  createOnboardingRequest,
  getOnboardingRequestContaining,
} from "@/queries/index"
import { sendRequestMail } from "@/services/send-email"
import { NEXTAUTH_URL } from "@/utils/env"
import graphQLFetcher from "@/utils/graphql-fetcher"
import httpLogger from "@/utils/http-logger"
import { getJwt } from "@/utils/jwt"
import logAction from "@/utils/log-action"
import { NextApiRequest, NextApiResponse } from "next"

const Request = async (req: NextApiRequest, res: NextApiResponse) => {
  httpLogger(req, res)
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    res.status(405).json({ message: "Method Not Allowed" })
    return
  }

  const token = getJwt()
  const onboardingRequest: OnboardingData = req.body.input.data

  logAction({
    action: "onboarding/request",
    token,
    parameters: JSON.stringify(onboardingRequest),
  })

  // avoid duplicate onboarding requests
  const { onboarding_requests: existingRequests } = await graphQLFetcher({
    query: getOnboardingRequestContaining,
    token,
    parameters: {
      contains: { email: onboardingRequest.email },
    },
  })
  if (existingRequests.length > 0) {
    req.log.info("a request with the same email already exists")
    res.status(200).json({
      status: 400,
      body: "already exists",
    })
    return
  }

  const {
    insert_onboarding_requests_one: { id },
  } = await graphQLFetcher({
    query: createOnboardingRequest,
    token,
    parameters: {
      request: { data: onboardingRequest },
    },
  })

  const url = new URL("/api/onboarding/confirm", NEXTAUTH_URL)
  url.searchParams.append("id", id)
  sendRequestMail(onboardingRequest.email, url.href)

  res.status(200).json({ status: 200, body: "request created" })
}

export default Request
