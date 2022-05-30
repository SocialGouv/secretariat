import { NextApiRequest, NextApiResponse } from "next"

import { getJwt } from "@/utils/jwt"
import fetcher from "@/utils/fetcher"
import { confirmOnboardingRequest, getCoreTeamUsers } from "@/queries/index"
import sendEmail from "@/utils/send-email"

const Confirm = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  const token = getJwt("admin")
  await fetcher(confirmOnboardingRequest, token, {
    cols: { id },
    data: { confirmed: true },
  })

  const {
    organization: {
      team: {
        members: { nodes: users },
      },
    },
  } = await fetcher(getCoreTeamUsers, token)

  const to = users.reduce(
    (emails: Record<"address", string>[], user: Record<"email", string>) => (
      user.email.length && emails.push({ address: user.email }), emails
    ),
    []
  )

  const url = `http://localhost:3000/onboarding/review?id=${id}`

  await sendEmail({
    to,
    msg: {
      from: {
        personalName: "La Fabrique Numérique des Ministères Sociaux",
        address: "noreply@fabrique.social.gouv.fr",
      },
      replyTo: {
        personalName: "La Fabrique Numérique des Ministères Sociaux",
        address: "noreply@fabrique.social.gouv.fr",
      },
      subject: "Demande d'onboarding",
      text: `Veuillez effectuer la revue de la demande d'onboarding en vous rendant à l'adresse suivante: ${url}`,
      html: `
        <p>Veuillez effectuer la revue de la demande d'onboarding en cliquant sur le bouton ci-dessous:</p>
        <a href="${url}">Revoir la demande d'onboarding</a>
      `,
    },
  })
  res.redirect("http://localhost:3000/onboarding/confirm")
}

export default Confirm
