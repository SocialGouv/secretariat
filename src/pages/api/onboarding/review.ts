import onboard from "@/services/onboard"
import sendEmail from "@/utils/send-email"
import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"

const Review = async (req: NextApiRequest, res: NextApiResponse) => {
  if (await getSession({ req })) {
    const result = await onboard(req.body.data)

    await sendEmail({
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
        subject: "Embarquement validé !",
        text: `Votre demande d'embarquement a été validée par un administrateur. Vous avez à présent accès aux services de la Fabbrique Numérique des Ministères Sociaux.`,
        html: `
          <p>Votre demande d'embarquement a été validée par un administrateur.</p>
          <p>Vous avez à présent accès aux services de la Fabbrique Numérique des Ministères Sociaux.</p>
          <p>Ci-dessous la liste des services qui vous sont ouverts:</p>
          ${
            "mattermost" in result
              ? '<div><a href="https://mattermost.fabrique.social.gouv.fr/">Mattermost</a></div>'
              : ""
          }
          ${
            "ovh" in result
              ? '<div><a href="https://www.ovh.com/">OVH</a></div>'
              : ""
          }
          ${
            "github" in result
              ? `<div><a href="https://github.com/SocialGouv">Github @SocialGouv</a></div>
          <div><a href="https://pastek.fabrique.social.gouv.fr/">Pastek</a></div>
          <div><a href="https://sentry.fabrique.social.gouv.fr/">Sentry</a></div>
          <div><a href="https://matomo.fabrique.social.gouv.fr/">Matomo</a></div>
          <div><a href="https://nextcloud.fabrique.social.gouv.fr/">NextCloud</a></div>`
              : ""
          }
        `,
      },
    })

    res.status(200).json(result)
  } else {
    res.status(403).end()
  }
}

export default Review
