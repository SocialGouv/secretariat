import { confirmOnboardingRequest } from "@/queries/index"
import { sendConfirmMail } from "@/services/send-email"
import { NEXTAUTH_URL, ONBOARDING_NOTIFICATION_EMAILS } from "@/utils/env"
import graphQLFetcher from "@/utils/graphql-fetcher"
import httpLogger from "@/utils/http-logger"
import { getJwt } from "@/utils/jwt"
import logAction from "@/utils/log-action"
import sendMattermostAlert from "@/utils/mattermost-alert"
import { NextApiRequest, NextApiResponse } from "next"

const Confirm = async (req: NextApiRequest, res: NextApiResponse) => {
  httpLogger(req, res)
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET")
    res.status(405).json({ message: "Method Not Allowed" })
    return
  }

  const { id } = req.query
  if (!id) {
    res.status(400).json({ message: "Missing id query parameter" })
    return
  }

  const token = getJwt()

  logAction({
    action: "onboarding/confirm",
    token,
    parameters: JSON.stringify({ id }),
  })

  const {
    update_onboarding_requests: { affected_rows, returning },
  } = await graphQLFetcher({
    query: confirmOnboardingRequest,
    token,
    parameters: {
      id,
    },
  })

  if (affected_rows === 1) {
    const recipients = ONBOARDING_NOTIFICATION_EMAILS.split(",").map(
      (email) => ({
        address: email,
      })
    )
    const { firstName, lastName } = returning[0].data

    const url = new URL("/onboarding/review", NEXTAUTH_URL)
    url.searchParams.append("id", Array.isArray(id) ? id[0] : id)

    const fullName = `${firstName} ${lastName}`
    sendConfirmMail(recipients, fullName, url.href)
    sendMattermostAlert(fullName, url.href)
  }

  res.redirect(new URL("/onboarding/confirm", NEXTAUTH_URL).href)
}

export default Confirm
