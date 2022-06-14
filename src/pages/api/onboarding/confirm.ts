import { NextApiRequest, NextApiResponse } from "next"

import { getJwt } from "@/utils/jwt"
import fetcher from "@/utils/fetcher"
import { NEXTAUTH_URL } from "@/utils/env"
import sendEmail from "@/utils/send-email"
import { confirmOnboardingRequest, getCoreTeamUsers } from "@/queries/index"

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

  const recipients = users.reduce(
    (emails: Record<"address", string>[], user: Record<"email", string>) => (
      user.email.length && emails.push({ address: user.email }), emails
    ),
    []
  )

  const url = new URL(NEXTAUTH_URL, "/onboarding/review")
  url.searchParams.append("id", Array.isArray(id) ? id[0] : id)

  await sendEmail(
    recipients,
    "Demande d'onboarding",
    `Une demande d'onboarding a été effectuée sur Secrétariat.
    
    En tant qu'administrateur, veuillez en effectuer la revue en suivant le lien :

    ${url.href}`,
    `<p>Une demande d'onboarding a été effectuée sur Secrétariat.</p>
    <p>
      En tant qu'administrateur, veuillez en effectuer la revue en cliquant sur le bouton ou en suivant le lien :
    </p>
    <a
      style="text-decoration: none; background-color: #000091; cursor: pointer; padding: 0.75rem; border: none; color: white"
      href="${url.href}"
    >
      Effectuer la revue
    </a>
    <p style="font-size: 1rem;">${url.href}</p>`
  )
  res.redirect(new URL(NEXTAUTH_URL, "/onboarding/confirm").href)
}

export default Confirm
