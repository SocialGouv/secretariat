import { TIPIMAIL_API_KEY, TIPIMAIL_API_USER } from "@/utils/env"

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
          personalName: "La Fabrique Numérique des Ministères Sociaux",
          address: "noreply@fabrique.social.gouv.fr",
        },
        replyTo: {
          personalName: "La Fabrique Numérique des Ministères Sociaux",
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

export default sendEmail
