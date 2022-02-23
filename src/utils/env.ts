// Private key to sign JWTs for Hasura
export const HASURA_JWT_KEY = process.env.HASURA_JWT_KEY ?? "undefined"

// Services tokens
export const MATOMO_API_TOKEN = process.env.MATOMO_API_TOKEN ?? "undefined"
export const SENTRY_API_TOKEN = process.env.SENTRY_API_TOKEN ?? "undefined"
export const OVH_APP_KEY = process.env.OVH_APP_KEY ?? "undefined"
export const OVH_APP_SECRET = process.env.OVH_APP_SECRET ?? "undefined"
export const OVH_CONSUMER_KEY = process.env.OVH_CONSUMER_KEY ?? "undefined"
export const OVH_SERVICE_NAME = process.env.OVH_SERVICE_NAME ?? "undefined"
export const ZAMMAD_API_TOKEN = process.env.ZAMMAD_API_TOKEN ?? "undefined"
export const NEXTCLOUD_API_LOGIN =
  process.env.NEXTCLOUD_API_LOGIN ?? "undefined"
export const NEXTCLOUD_API_SECRET =
  process.env.NEXTCLOUD_API_SECRET ?? "undefined"
export const MATTERMOST_API_TOKEN =
  process.env.MATTERMOST_API_TOKEN ?? "undefined"

// Github sends this to authenticate its webhook
export const GITHUB_WEBHOOK_SECRET =
  process.env.GITHUB_WEBHOOK_SECRET ?? "undefined"

// Github auth provider
export const GITHUB_ID = process.env.GITHUB_ID ?? "undefined"
export const GITHUB_SECRET = process.env.GITHUB_SECRET ?? "undefined"

export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET ?? "undefined"
