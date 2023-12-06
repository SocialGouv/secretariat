import { GITHUB_API_TOKEN } from "@/utils/env"

export function disableGithubAccount(username: string) {
  // Removes a member from the SocialGouv organization with its login
  return fetch(
    `https://api.github.com/orgs/SocialGouv/memberships/${username}`,
    {
      method: "DELETE",
      headers: {
        accept: "application/vnd.github+json",
        authorization: `Bearer ${GITHUB_API_TOKEN}`,
      },
    }
  )
}
