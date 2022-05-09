import { TIPIMAIL_API_KEY, TIPIMAIL_API_USER } from "@/utils/env"

const sendEmail = async (email: Record<string, unknown>) => {
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
  console.log("EMAIL SENT:", result)
}

export default sendEmail
