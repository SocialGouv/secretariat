// Private key to sign JWTs for Hasura
export const HASURA_JWT_KEY = process.env.HASURA_JWT_KEY

// Services tokens
export const MATOMO_API_TOKEN = process.env.MATOMO_API_TOKEN
export const SENTRY_API_TOKEN = process.env.SENTRY_API_TOKEN
export const OVH_APP_KEY = process.env.OVH_APP_KEY
export const OVH_APP_SECRET = process.env.OVH_APP_SECRET
export const OVH_CONSUMER_KEY = process.env.OVH_CONSUMER_KEY
export const OVH_SERVICE_NAME = process.env.OVH_SERVICE_NAME
export const ZAMMAD_API_TOKEN = process.env.ZAMMAD_API_TOKEN
export const NEXTCLOUD_API_LOGIN = process.env.NEXTCLOUD_API_LOGIN
export const NEXTCLOUD_API_SECRET = process.env.NEXTCLOUD_API_SECRET
export const MATTERMOST_API_TOKEN = process.env.MATTERMOST_API_TOKEN

// Github sends this to authenticate its webhook
export const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET

// Github auth provider
export const GITHUB_ID = process.env.GITHUB_ID
export const GITHUB_SECRET = process.env.GITHUB_SECRET

export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET
