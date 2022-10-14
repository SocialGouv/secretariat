import { TIPIMAIL_API_KEY, TIPIMAIL_API_USER } from "@/utils/env"
import statusOk from "./status-ok"

const html = (body: string) => `
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media (min-width: 1024px) {
      .container {
        width: 50vw
      }
    }
  </style>
</head>
<div class="container" style="font-size: 1.2rem; font-family: Arial, sans-serif; background-color: #f5f5fe; color: #3a3a3a; border-radius: 0.25rem; padding: 1rem; margin: 0 auto;">
    <section>
      <p style="margin: 0; font-size: 2rem; color: #161616;">Secrétariat</p>
      <p style="margin: 0; color: #666666;">
        Gestion des comptes de services
        <a href="https://github.com/SocialGouv">@SocialGouv</a>
      </p>
    </section>

    <br/>

    <section>
      ${body}
    </section>

    <br/>
    <br/>

    <section style="font-size: 0.8rem; font-style: italic; color: #666666;">
      <p>
        Cet email a été envoyé automatiquement par
        <a href="https://github.com/SocialGouv/secretariat">Secrétariat</a>, une application permettant de gérer les accès des utilisateurs aux services de la Fabrique Numérique des Ministères Sociaux.
      </p>
      <p style="margin-bottom: 0;">Merci de ne pas répondre à cet email.</p>
    </section>
</div>
`

const text = (body: string) => `
Secrétariat
Gestion des comptes de services @SocialGouv

${body}

Cet email a été envoyé automatiquement par Secrétariat, une application permettant de gérer les accès des utilisateurs aux services de la Fabrique Numérique des Ministères Sociaux.
Merci de ne pas réponde à cet email.
`

const sendEmail = async (
  recipients: Record<string, unknown>[],
  subject: string,
  textBody: string,
  htmlBody: string
) =>
  fetch("https://api.tipimail.com/v1/messages/send", {
    method: "POST",
    body: JSON.stringify({
      to: recipients,
      msg: {
        from: {
          personalName: "Fabrique Numérique des Ministères Sociaux",
          address: "noreply@fabrique.social.gouv.fr",
        },
        replyTo: {
          personalName: "Fabrique Numérique des Ministères Sociaux",
          address: "noreply@fabrique.social.gouv.fr",
        },
        subject,
        text: text(textBody),
        html: html(htmlBody),
      },
    }),
    headers: {
      "Content-Type": "application/json",
      "X-Tipimail-ApiKey": TIPIMAIL_API_KEY,
      "X-Tipimail-ApiUser": TIPIMAIL_API_USER,
    },
  })

export const sendReviewMail = (
  onboardingResponses: OnboardingResponses,
  email: string
) => {
  sendEmail(
    [
      {
        address: email,
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
  "mattermost" in onboardingResponses
    ? `- Mattermost : https://mattermost.fabrique.social.gouv.fr/ ${
        statusOk(onboardingResponses.mattermost!.status)
          ? '(générer un nouveau mot de passe en cliquant sur "mot de passe oublié")'
          : "(erreur lors de la création automatique du compte)"
      }`
    : ""
}
${
  "ovh" in onboardingResponses
    ? `- Mail OVH : https://pro2.mail.ovh.net/ ${
        statusOk(onboardingResponses.ovh!.status)
          ? `
  - adresse : ${onboardingResponses.ovh!.mailInfo.login}@fabrique.social.gouv.fr
  - mot de passe : ${onboardingResponses.ovh!.mailInfo.password} (à changer)`
          : "(erreur lors de la création automatique du compte)"
      }`
    : ""
}
${
  "github" in onboardingResponses
    ? `- Github @SocialGouv : https://github.com/SocialGouv${
        !statusOk(onboardingResponses.github!.status)
          ? " (erreur lors de l'invitation du compte Github)"
          : ""
      }
- Zammad : https://pastek.fabrique.social.gouv.fr/${
        !statusOk(onboardingResponses.github!.status)
          ? " (erreur lors de l'invitation du compte Github)"
          : ""
      }
- Sentry : https://sentry.fabrique.social.gouv.fr/${
        !statusOk(onboardingResponses.github!.status)
          ? " (erreur lors de l'invitation du compte Github)"
          : ""
      }
- Matomo : https://matomo.fabrique.social.gouv.fr/${
        !statusOk(onboardingResponses.github!.status)
          ? " (erreur lors de l'invitation du compte Github)"
          : ""
      }
- Nextcloud : https://nextcloud.fabrique.social.gouv.fr/${
        !statusOk(onboardingResponses.github!.status)
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
  "mattermost" in onboardingResponses
    ? `<li><a href="https://mattermost.fabrique.social.gouv.fr/">Mattermost</a> ${
        statusOk(onboardingResponses.mattermost!.status)
          ? '(générer un nouveau mot de passe en cliquant sur "mot de passe oublié")'
          : "(erreur lors de la création automatique du compte)"
      }</li>`
    : ""
}
${
  "ovh" in onboardingResponses
    ? `<li><a href="https://pro2.mail.ovh.net/">Mail OVH</a> ${
        statusOk(onboardingResponses.ovh!.status)
          ? `<ul>
  <li>adresse : ${
    onboardingResponses.ovh!.mailInfo.login
  }@fabrique.social.gouv.fr</li>
  <li>mot de passe : ${
    onboardingResponses.ovh!.mailInfo.password
  } (à changer)</li>
</ul>`
          : "(erreur lors de la création automatique du compte)"
      }
</li>`
    : ""
}
${
  "github" in onboardingResponses
    ? `<li><a href="https://github.com/SocialGouv">Github @SocialGouv</a> ${
        !statusOk(onboardingResponses.github!.status)
          ? "(erreur lors de l'invitation du compte Github)"
          : ""
      }</li>
<li><a href="https://pastek.fabrique.social.gouv.fr/">Zammad</a> ${
        !statusOk(onboardingResponses.github!.status)
          ? "(erreur lors de l'invitation du compte Github)"
          : ""
      }</li>
<li><a href="https://sentry.fabrique.social.gouv.fr/">Sentry</a> ${
        !statusOk(onboardingResponses.github!.status)
          ? "(erreur lors de l'invitation du compte Github)"
          : ""
      }</li>
<li><a href="https://matomo.fabrique.social.gouv.fr/">Matomo</a> ${
        !statusOk(onboardingResponses.github!.status)
          ? "(erreur lors de l'invitation du compte Github)"
          : ""
      }</li>
<li><a href="https://nextcloud.fabrique.social.gouv.fr/">NextCloud</a> ${
        !statusOk(onboardingResponses.github!.status)
          ? "(erreur lors de l'invitation du compte Github)"
          : ""
      }</li>`
    : ""
}`
  )
}

export const sendConfirmMail = (
  recipients: {
    address: string
  }[],
  firstName: string,
  lastName: string,
  url: string
) => {
  sendEmail(
    recipients,
    `Demande d'onboarding de ${firstName} ${lastName}`,
    `Une demande d'onboarding a été effectuée sur Secrétariat.

En tant qu'administrateur, veuillez en effectuer la revue en suivant le lien :

${url}`,
    `<p>Une demande d'onboarding a été effectuée sur Secrétariat.</p>
<p>
  En tant qu'administrateur, veuillez en effectuer la revue en cliquant sur le bouton :
</p>
<div style="text-align: center;">
  <a
    style="text-decoration: none; background-color: #000091; cursor: pointer; padding: 0.75rem; border: none; color: #f5f5fe;"
    href="${url}"
  >
    Effectuer la revue
  </a>
</div>`
  )
}

export const sendRequestMail = (email: string, url: string) => {
  return sendEmail(
    [
      {
        address: email,
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
      style="text-decoration: none; background-color: #000091; cursor: pointer; padding: 0.75rem; border: none; color: #f5f5fe;"
      href="${url}"
      >
        Vérifier
      </a>
    </div>`
  )
}
