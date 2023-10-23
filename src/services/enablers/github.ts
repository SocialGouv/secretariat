import { GITHUB_API_TOKEN } from "@/utils/env"

export async function enableGithubAccount(username: string) {
  const idResponse = await fetch(`https://api.github.com/users/${username}`, {
    headers: { accept: "application/vnd.github.v3+json" },
  })
  const { id: userID } = await idResponse.json()

  return fetch(`https://api.github.com/orgs/SocialGouv/invitations`, {
    method: "POST",
    headers: {
      accept: "application/vnd.github.v3+json",
      authorization: `Bearer ${GITHUB_API_TOKEN}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ invitee_id: userID, role: "reinstate" }),
  })
}
