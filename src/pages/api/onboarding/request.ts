import { NextApiRequest, NextApiResponse } from "next"
import { deleteGithubAccount } from "@/services/delete-account"
import { getSession } from "next-auth/react"
import fetcher from "@/utils/fetcher"
import { createOnboardingRequest } from "@/queries/index"
import { getJwt } from "@/utils/jwt"
import { TIPIMAIL_API_KEY, TIPIMAIL_API_USER } from "@/utils/env"

const sendEmail = async (email: Record<string, unknown>) => {
  console.log("TIPIMAIL_API_KEY", TIPIMAIL_API_KEY)
  console.log("TIPIMAIL_API_USER", TIPIMAIL_API_USER)
  email.apiKey = TIPIMAIL_API_KEY
  const result = await fetch("https://api.tipimail.com/v1/messages/send", {
    method: "POST",
    body: JSON.stringify(email),
    headers: {
      "Content-Type": "application/json",
      "X-Tipimail-ApiKey": TIPIMAIL_API_KEY,
      "X-Tipimail-ApiUser": TIPIMAIL_API_USER,
    },
  })
  console.log("result", result)
}

const Endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
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
        personalName: `${req.body.firstName} ${req.body.lastName}`,
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
  // console.log("ID", id)
  // const result = await fetcher(insertOnboardingRequest, token, {
  //   request: { data: req.body },
  // })
  // console.log("ID", result)
  // res.end()
  // if (await getSession({ req })) {
  //   const { userLogin } = req.query
  //   const { status, body } = await deleteGithubAccount(userLogin as string)
  //   res.status(status).send(body)
  // } else {
  //   res.status(403).end()
  // }
}

export default Endpoint
