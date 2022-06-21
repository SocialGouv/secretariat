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

  const url = new URL("/api/onboarding/confirm", NEXTAUTH_URL)
  url.searchParams.append("id", id)

  const response = await sendEmail(
    [
      {
        address: req.body.data.email,
      },
    ],
    "Vérification de votre adresse mail",
    `Veuillez effectuer la vérification de votre adresse mail en vous rendant à l'adresse suivante : ${url}`,
    `<p>Veuillez effectuer la vérification de votre adresse email en cliquant sur le bouton ou en suivant le lien :</p>
    <a
      style="text-decoration: none; background-color: #000091; cursor: pointer; padding: 0.75rem; border: none; color: white"
      href="${url}"
    >
      Vérifier
    </a>
    <p style="font-size: 1rem;">${url}</p>`
  )

  res.status(response.status).json({ id })
}

export default Request
