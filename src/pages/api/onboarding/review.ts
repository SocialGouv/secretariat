import { getOnboardingRequest, updateOnboardingRequest } from "@/queries/index"
import onboard from "@/services/onboard"
import { sendReviewMail } from "@/services/send-email"
// import graphQLFetcher from "@/utils/graphql-fetcher"
import graphQLServiceFetcher from "@/utils/graphql-service-fetcher"
import httpLogger from "@/utils/http-logger"
import { COOKIE_NAME, decode, getJwt } from "@/utils/jwt"
import logAction from "@/utils/log-action"
import { NextApiRequest, NextApiResponse } from "next"
import { getToken } from "next-auth/jwt"

const Review = async (req: NextApiRequest, res: NextApiResponse) => {
  httpLogger(req, res)
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    res.status(405).json({ message: "Method Not Allowed" })
    return
  }

  const userToken = await getToken({ req, decode, cookieName: COOKIE_NAME })

  if (!userToken) {
    res.status(403).json({ message: "Unauthorized" })
    return
  }

  const token = getJwt()

  const { data, id } = req.body.input

  const { onboarding_requests: requests } = await graphQLServiceFetcher({
    query: getOnboardingRequest,
    token,
    parameters: {
      id,
    },
  })

  if (requests.length === 0) {
    res
      .status(500)
      .json({ message: "Could not find an onboarding request for this ID" })
    return
  } else if (requests.length > 1) {
    res.status(500).json({ message: "Found multiple requests for this ID" })
    return
  }

  if (requests[0].reviewed) {
    res.status(400).json({ message: "Onboarding request already reviewed" })
    return
  }

  graphQLServiceFetcher({
    query: updateOnboardingRequest,
    token,
    parameters: {
      cols: { id },
      data: {
        reviewed: {
          date: new Date(),
          author: userToken.user.login,
        },
        data,
      },
    },
  })

  logAction({
    action: "onboarding/review",
    user: userToken.user.login,
    token,
    parameters: JSON.stringify(data),
  })

  const result = await onboard(data, id)
  sendReviewMail(result, data.email)

  res.status(200).json(result)
}

export default Review
