import { MATTERMOST_ALERT_CHANNEL_ID, MATTERMOST_API_TOKEN } from "./env"

const makeMessage = (fullName: string, url: string) =>
  `**${fullName}** a confirmé une demande d'onboarding sur Secrétariat.

En tant qu'administrateur, veuillez en [effectuer la revue](${url}).`

const sendMattermostAlert = (fullName: string, url: string) => {
  // If the channel ID is not set, we're not supposed to notify via Mattermost
  if (!MATTERMOST_ALERT_CHANNEL_ID) return

  return fetch("https://mattermost.fabrique.social.gouv.fr/api/v4/posts", {
    method: "POST",
    headers: {
      authorization: `Bearer ${MATTERMOST_API_TOKEN}`,
    },
    body: JSON.stringify({
      channel_id: MATTERMOST_ALERT_CHANNEL_ID,
      message: makeMessage(fullName, url),
    }),
  })
}

export default sendMattermostAlert
