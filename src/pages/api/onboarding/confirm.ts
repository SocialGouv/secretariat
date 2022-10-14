import { NextApiRequest, NextApiResponse } from "next"

import { getJwt } from "@/utils/jwt"
import graphQLFetcher from "@/utils/graphql-fetcher"
import { NEXTAUTH_URL, ONBOARDING_NOTIFICATION_EMAILS } from "@/utils/env"
import { sendConfirmMail } from "@/utils/send-email"
import { confirmOnboardingRequest } from "@/queries/index"
import logAction from "@/utils/log-action"

const Confirm = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET")
    res.status(405).json({ message: "Method Not Allowed" })
    return
  }

  const { id } = req.query
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

    console.log("sending email notification to recipients:", recipients)
    sendConfirmMail(recipients, firstName, lastName, url.href)
  }

  res.redirect(new URL("/onboarding/confirm", NEXTAUTH_URL).href)
}

export default Confirm
