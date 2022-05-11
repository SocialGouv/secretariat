import { NextApiRequest, NextApiResponse } from "next"

import { getJwt } from "@/utils/jwt"
import fetcher from "@/utils/fetcher"
import sendEmail from "@/utils/send-email"
import { createOnboardingRequest } from "@/queries/index"

const Request = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = getJwt("admin")
  console.log("BODY", req.body, req.body.data)
  const {
    insert_onboarding_requests_one: { id },
  } = await fetcher(createOnboardingRequest, token, {
    request: { data: req.body },
  })

  const url = `http://localhost:3000/api/onboarding/confirm?id=${id}`

  await sendEmail({
    to: [
      {
        address: req.body.email,
        // personalName: `${req.body.firstName} ${req.body.lastName}`,
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
      subject: "Vérification de votre adresses mail",
      text: `Veuillez effectuer la vérification de votre adresse mail en vous rendant à l'adresse suivante: ${url}`,
      html: `
        <p>Veuillez effectuer la vérification de votre adresse mail en cliquant sur le bouton ci-dessous:</p>
        <a href="${url}">Confirmez votre demande d'onboarding</a>
      `,
    },
  })

  res.json({ id })
}

export default Request
