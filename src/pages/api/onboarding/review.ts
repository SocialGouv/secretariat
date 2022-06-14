import onboard from "@/services/onboard"
import sendEmail from "@/utils/send-email"
import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"

const Review = async (req: NextApiRequest, res: NextApiResponse) => {
  if (await getSession({ req })) {
    const result = await onboard(req.body.data)

    await sendEmail(
      [
        {
          address: req.body.data.email,
        },
      ],
      "Embarquement validé !",
      `Votre demande d'embarquement a été validée par un administrateur. Vous avez à présent accès aux services de la Fabrique Numérique des Ministères Sociaux.
      
      Vous avez à présent accès aux services de la Fabrique Numérique des Ministères Sociaux.
      
      Ci-dessous la liste des services qui vous sont ouverts :

        ${
          "mattermost" in result
            ? "Mattermost : https://mattermost.fabrique.social.gouv.fr"
            : ""
        }
        ${"ovh" in result ? "OVH : https://www.ovh.com/" : ""}
        ${
          "github" in result
            ? `Github : https://github.com/SocialGouv
              Pastek : https://pastek.fabrique.social.gouv.fr/
              Sentry : https://sentry.fabrique.social.gouv.fr/
              Matomo : https://matomo.fabrique.social.gouv.fr/
              Nextcloud : https://nextcloud.fabrique.social.gouv.fr/`
            : ""
        }`,
      `
        <p>Votre demande d'embarquement a été validée par un administrateur.</p>
        <p>Vous avez à présent accès aux services de la Fabrique Numérique des Ministères Sociaux.</p>
        <p>Ci-dessous la liste des services qui vous sont ouverts :</p>
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
        `
    )

    res.status(200).json(result)
  } else {
    res.status(403).end()
  }
}

export default Review
