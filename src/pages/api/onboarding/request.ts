import { NextApiRequest, NextApiResponse } from "next"

import { getJwt } from "@/utils/jwt"
import graphQLFetcher from "@/utils/graphql-fetcher"
import sendEmail from "@/utils/send-email"
import { NEXTAUTH_URL } from "@/utils/env"
import { createOnboardingRequest } from "@/queries/index"

const Request = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    insert_onboarding_requests_one: { id },
  } = await graphQLFetcher({
    query: createOnboardingRequest,
    token: getJwt(),
    parameters: {
      request: { data: req.body.data },
    },
  })

  const url = new URL("/api/onboarding/confirm", NEXTAUTH_URL)
  url.searchParams.append("id", id)

  const response = await sendEmail(
    [
      {
        address: req.body.data.email,
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
      style="text-align: center; text-decoration: none; background-color: #000091; cursor: pointer; padding: 0.75rem; border: none; color: #f5f5fe;"
      href="${url}"
      >
        Vérifier
      </a>
    </div>`
  )

  res.status(response.status).json({ id })
}

export default Request
