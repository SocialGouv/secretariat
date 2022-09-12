import { NextApiRequest, NextApiResponse } from "next"

import { getJwt } from "@/utils/jwt"
import graphQLFetcher from "@/utils/graphql-fetcher"
import { NEXTAUTH_URL, ONBOARDING_NOTIFICATION_EMAILS } from "@/utils/env"
import sendEmail from "@/utils/send-email"
import { updateOnboardingRequest } from "@/queries/index"
import logAction from "@/utils/log-action"

const Confirm = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405).end()
    return
  }

  const { id } = req.query
  const token = getJwt()

  logAction({
    action: "onboarding/confirm",
    token,
    parameters: JSON.stringify({ id }),
  })

  await graphQLFetcher({
    query: updateOnboardingRequest,
    token,
    parameters: {
      cols: { id },
      data: { confirmed: true },
    },
  })

  const recipients = ONBOARDING_NOTIFICATION_EMAILS.split(",").map((email) => ({
    address: email,
  }))
  console.log("Sending email notification to recipients:", recipients)

  const url = new URL("/onboarding/review", NEXTAUTH_URL)
  url.searchParams.append("id", Array.isArray(id) ? id[0] : id)

  await sendEmail(
    recipients,
    "Demande d'onboarding",
    `Une demande d'onboarding a été effectuée sur Secrétariat.

    En tant qu'administrateur, veuillez en effectuer la revue en suivant le lien :

    ${url.href}`,
    `<p>Une demande d'onboarding a été effectuée sur Secrétariat.</p>
    <p>
      En tant qu'administrateur, veuillez en effectuer la revue en cliquant sur le bouton :
    </p>
    <div style="text-align: center;">
      <a
        style="text-decoration: none; background-color: #000091; cursor: pointer; padding: 0.75rem; border: none; color: #f5f5fe;"
        href="${url.href}"
      >
        Effectuer la revue
      </a>
    </div>`
  )
  res.redirect(new URL("/onboarding/confirm", NEXTAUTH_URL).href)
}

export default Confirm
