import { TIPIMAIL_API_KEY, TIPIMAIL_API_USER } from "@/utils/env"

const html = (body: string) => `
<div style="text-align: center; font-size: 1.2rem; font-family: Arial, sans-serif; background-color: #f6f6f6; border-radius: 4px; padding: 3rem 1rem;">
  <section>
    <p style="margin: 0; font-size: 3rem;"><strong>Secrétariat</strong></p>
    <p style="margin: 0">
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

  <section style="font-size: 0.8rem; font-style: italic;">
    <p>
      Cet email a été envoyé automatiquement par
      <a href="https://github.com/SocialGouv/secretariat">Secrétariat</a>, une application permettant de gérer les accès des utilisateurs aux services de la Fabrique Numérique.
    </p>
    <p style="margin-bottom: 0;">Merci de ne pas répondre à cet email.</p>
  </section>
</div>
`

const text = (body: string) => `
Secrétariat
Gestion des comptes de services @SocialGouv

${body}

Cet email a été envoyé automatiquement par Secrétariat, une application permettant de gérer les accès des utilisateurs aux services de la Fabrique Numérique.
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
