import { TIPIMAIL_API_KEY, TIPIMAIL_API_USER } from "@/utils/env"

const sendEmail = async (email: Record<string, unknown>) =>
  fetch("https://api.tipimail.com/v1/messages/send", {
    method: "POST",
    body: JSON.stringify(email),
    headers: {
      "Content-Type": "application/json",
      "X-Tipimail-ApiKey": TIPIMAIL_API_KEY,
      "X-Tipimail-ApiUser": TIPIMAIL_API_USER,
    },
  })

export default sendEmail
