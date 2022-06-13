import { NextApiRequest, NextApiResponse } from "next"

import { getJwt } from "@/utils/jwt"
import fetcher from "@/utils/fetcher"
import sendEmail from "@/utils/send-email"
import { NEXTAUTH_URL } from "@/utils/env"
import { createOnboardingRequest } from "@/queries/index"

const Request = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = getJwt("admin")

  const {
    insert_onboarding_requests_one: { id },
  } = await fetcher(createOnboardingRequest, token, {
    request: { data: req.body.data },
  })

  const url = new URL(NEXTAUTH_URL, "/api/onboarding/confirm")
  url.searchParams.append("id", id)

  const response = await sendEmail({
    to: [
      {
        address: req.body.data.email,
      },
    ],
    msg: {
      from: {
        personalName: "La Fabrique Numérique des Ministères Sociaux",
        address: "noreply@fabrique.social.gouv.fr",
      },
      replyTo: {
        personalName: "La Fabrique Numérique des Ministères Sociaux",
        address: "noreply@fabrique.social.gouv.fr",
      },
      subject: "Vérification de votre adresse mail",
      text: `Veuillez effectuer la vérification de votre adresse mail en vous rendant à l'adresse suivante: ${url}`,
      html: `
        <p>Veuillez effectuer la vérification de votre adresse mail en cliquant sur le bouton ci-dessous:</p>
        <a href="${url}">Confirmez votre demande d'onboarding</a>
      `,
    },
  })

  res.status(response.status).json({ id })
}

export default Request
