import { NextApiRequest, NextApiResponse } from "next"

import { getJwt } from "@/utils/jwt"
import graphQLFetcher from "@/utils/graphql-fetcher"
import sendEmail from "@/utils/send-email"
import { NEXTAUTH_URL } from "@/utils/env"
import { createOnboardingRequest } from "@/queries/index"
import logAction from "@/utils/log-action"

const Request = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = getJwt()

  logAction({
    action: "onboarding/request",
    token,
    parameters: JSON.stringify(req.body.input.data),
  })

  const {
    insert_onboarding_requests_one: { id },
  } = await graphQLFetcher({
    query: createOnboardingRequest,
    token,
    parameters: {
      request: { data: req.body.input.data },
    },
  })

  const url = new URL("/api/onboarding/confirm", NEXTAUTH_URL)
  url.searchParams.append("id", id)

  const response = await sendEmail(
    [
      {
        address: req.body.input.data.email,
      },
    ],
    "Vérification de votre adresse mail",
    `Vous avez effectué une demande d'embarquement au sein de la Fabrique Numérique des Ministères Sociaux.
    Veuillez effectuer la vérification de votre adresse mail en vous rendant à l'adresse ci-dessous :
    ${url}`,
    `<p>Vous avez effectué une demande d'embarquement au sein de la Fabrique Numérique des Ministères Sociaux.</p>
    <p>Veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous&nbsp:</p>
    <div style="text-align: center;">
      <a
      style="text-decoration: none; background-color: #000091; cursor: pointer; padding: 0.75rem; border: none; color: #f5f5fe;"
      href="${url}"
      >
        Vérifier
      </a>
    </div>`
  )

  res.status(200).json({ status: response.status, body: await response.text() })
}

export default Request
