import { NextApiRequest, NextApiResponse } from "next"

import { getJwt } from "@/utils/jwt"
import graphQLFetcher from "@/utils/graphql-fetcher"
import { sendRequestMail } from "@/utils/send-email"
import { NEXTAUTH_URL } from "@/utils/env"
import {
  createOnboardingRequest,
  getOnboardingRequestContaining,
} from "@/queries/index"
import logAction from "@/utils/log-action"

const Request = async (req: NextApiRequest, res: NextApiResponse) => {
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

  const mailResponse = await sendRequestMail(onboardingRequest.email, url.href)
  console.log(
    "tipimail API response:",
    mailResponse.status,
    await mailResponse.text()
  )

  res.status(200).json({ status: 200, body: "request created" })
}

export default Request
