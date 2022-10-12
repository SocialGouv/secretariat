import { getOnboardingRequest, updateOnboardingRequest } from "@/queries/index"
import onboard from "@/services/onboard"
import graphQLFetcher from "@/utils/graphql-fetcher"
import { COOKIE_NAME, decode, getJwt } from "@/utils/jwt"
import logAction from "@/utils/log-action"
import sendEmail from "@/utils/send-email"
import statusOk from "@/utils/status-ok"
import { NextApiRequest, NextApiResponse } from "next"
import { getToken } from "next-auth/jwt"

const Review = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    res.status(405).json({ message: "Method Not Allowed" })
    return
  }

  const userToken = await getToken({ req, decode, cookieName: COOKIE_NAME })

  if (!userToken) {
    res.status(403).json({ message: "Unauthorized" })
    return
  }

  const token = getJwt()

  const { data, id } = req.body.input

  const { onboarding_requests: requests } = await graphQLFetcher({
    query: getOnboardingRequest,
    token,
    parameters: {
      id,
    },
  })

  if (requests.length === 0) {
    res
      .status(500)
      .json({ message: "Could not find an onboarding request for this ID" })
    return
  } else if (requests.length > 1) {
    res.status(500).json({ message: "Found multiple requests for this ID" })
    return
  }

  if (requests[0].reviewed) {
    res.status(400).json({ message: "Onboarding request already reviewed" })
    return
  }

  await graphQLFetcher({
    query: updateOnboardingRequest,
    token,
    parameters: {
      cols: { id },
      data: {
        reviewed: {
          date: new Date().toLocaleString("fr-FR"),
          author: userToken.user.login,
        },
        data,
      },
    },
  })

  logAction({
    action: "onboarding/review",
    user: userToken.user.login,
    token,
    parameters: JSON.stringify(data),
  })

  const result = await onboard(data)

  await sendEmail(
    [
      {
        address: data.email,
      },
    ],
    "Bienvenue à la Fabrique",
    `Votre demande d'embarquement a été validée par un administrateur, bienvenue à la Fabrique numérique des Ministères Sociaux.

Voici quelques ressources pour débuter :
- Charte de collaboration : https://github.com/SocialGouv/www/wiki/Charte-de-collaboration
- Espace Notion : https://www.notion.so/fabnummas/La-Fabrique-pour-tous-18c0f050420846379e0e971402c2f58c
- Site web : https://www.fabrique.social.gouv.fr/
- Documentation générale de beta.gouv.fr : https://doc.incubateur.net/
- Documentation technique de la Fabrique : https://socialgouv.github.io/support

Vous avez à présent accès aux services de la Fabrique Numérique des Ministères Sociaux. Ci-dessous la liste des services qui vous sont accessibles :
${
  "mattermost" in result
    ? `- Mattermost : https://mattermost.fabrique.social.gouv.fr/ ${
        statusOk(result.mattermost!.status)
          ? '(générer un nouveau mot de passe en cliquant sur "mot de passe oublié")'
          : "(erreur lors de la création automatique du compte)"
      }`
    : ""
}
${
  "ovh" in result
    ? `- Mail OVH : https://pro2.mail.ovh.net/ ${
        statusOk(result.ovh!.status)
          ? `
  - adresse : ${result.ovh!.mailInfo.login}@fabrique.social.gouv.fr
  - mot de passe : ${result.ovh!.mailInfo.password} (à changer)`
          : "(erreur lors de la création automatique du compte)"
      }`
    : ""
}
${
  "github" in result
    ? `- Github @SocialGouv : https://github.com/SocialGouv${
        !statusOk(result.github!.status)
          ? " (erreur lors de l'invitation du compte Github)"
          : ""
      }
- Zammad : https://pastek.fabrique.social.gouv.fr/${
        !statusOk(result.github!.status)
          ? " (erreur lors de l'invitation du compte Github)"
          : ""
      }
- Sentry : https://sentry.fabrique.social.gouv.fr/${
        !statusOk(result.github!.status)
          ? " (erreur lors de l'invitation du compte Github)"
          : ""
      }
- Matomo : https://matomo.fabrique.social.gouv.fr/${
        !statusOk(result.github!.status)
          ? " (erreur lors de l'invitation du compte Github)"
          : ""
      }
- Nextcloud : https://nextcloud.fabrique.social.gouv.fr/${
        !statusOk(result.github!.status)
          ? " (erreur lors de l'invitation du compte Github)"
          : ""
      }`
    : ""
}`,
    `<p>Votre demande d'embarquement a été validée par un administrateur, bienvenue à la Fabrique numérique des Ministères Sociaux.</p>
<p>Voici quelques ressources pour débuter&nbsp:</p>
  <li><a href="https://github.com/SocialGouv/www/wiki/Charte-de-collaboration">Charte de collaboration</a></li>
  <li><a href="https://www.notion.so/fabnummas/La-Fabrique-pour-tous-18c0f050420846379e0e971402c2f58c">Espace Notion</a></li>
  <li><a href="https://www.fabrique.social.gouv.fr/">Site web</a></li>
  <li><a href="https://doc.incubateur.net/">Documentation générale de beta.gouv.fr</a></li>
  <li><a href="https://socialgouv.github.io/support">Documentation technique de la Fabrique</a></li>
<p>Vous avez à présent accès aux services de la Fabrique Numérique des Ministères Sociaux. Ci-dessous la liste des services qui vous sont accessibles&nbsp:</p>
${
  "mattermost" in result
    ? `<li><a href="https://mattermost.fabrique.social.gouv.fr/">Mattermost</a> ${
        statusOk(result.mattermost!.status)
          ? '(générer un nouveau mot de passe en cliquant sur "mot de passe oublié")'
          : "(erreur lors de la création automatique du compte)"
      }</li>`
    : ""
}
${
  "ovh" in result
    ? `<li><a href="https://pro2.mail.ovh.net/">Mail OVH</a> ${
        statusOk(result.ovh!.status)
          ? `<ul>
  <li>adresse : ${result.ovh!.mailInfo.login}@fabrique.social.gouv.fr</li>
  <li>mot de passe : ${result.ovh!.mailInfo.password} (à changer)</li>
</ul>`
          : "(erreur lors de la création automatique du compte)"
      }
</li>`
    : ""
}
${
  "github" in result
    ? `<li><a href="https://github.com/SocialGouv">Github @SocialGouv</a> ${
        !statusOk(result.github!.status)
          ? "(erreur lors de l'invitation du compte Github)"
          : ""
      }</li>
<li><a href="https://pastek.fabrique.social.gouv.fr/">Zammad</a> ${
        !statusOk(result.github!.status)
          ? "(erreur lors de l'invitation du compte Github)"
          : ""
      }</li>
<li><a href="https://sentry.fabrique.social.gouv.fr/">Sentry</a> ${
        !statusOk(result.github!.status)
          ? "(erreur lors de l'invitation du compte Github)"
          : ""
      }</li>
<li><a href="https://matomo.fabrique.social.gouv.fr/">Matomo</a> ${
        !statusOk(result.github!.status)
          ? "(erreur lors de l'invitation du compte Github)"
          : ""
      }</li>
<li><a href="https://nextcloud.fabrique.social.gouv.fr/">NextCloud</a> ${
        !statusOk(result.github!.status)
          ? "(erreur lors de l'invitation du compte Github)"
          : ""
      }</li>`
    : ""
}`
  )
  res.status(200).json(result)
}

export default Review
