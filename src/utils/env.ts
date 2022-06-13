// Private key to sign JWTs for Hasura
export const HASURA_JWT_KEY = process.env.HASURA_JWT_KEY as string

// Services tokens
export const MATOMO_API_TOKEN = process.env.MATOMO_API_TOKEN as string
export const SENTRY_API_TOKEN = process.env.SENTRY_API_TOKEN as string
export const OVH_APP_KEY = process.env.OVH_APP_KEY as string
export const OVH_APP_SECRET = process.env.OVH_APP_SECRET as string
export const OVH_CONSUMER_KEY = process.env.OVH_CONSUMER_KEY as string
export const OVH_SERVICE_NAME = process.env.OVH_SERVICE_NAME as string
export const ZAMMAD_API_TOKEN = process.env.ZAMMAD_API_TOKEN as string
export const NEXTCLOUD_API_LOGIN = process.env.NEXTCLOUD_API_LOGIN as string
export const NEXTCLOUD_API_SECRET = process.env.NEXTCLOUD_API_SECRET as string
export const MATTERMOST_API_TOKEN = process.env.MATTERMOST_API_TOKEN as string
export const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN as string

// Github sends this to authenticate its webhook
export const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET as string

// Github auth provider
export const GITHUB_ID = process.env.GITHUB_ID as string
export const GITHUB_SECRET = process.env.GITHUB_SECRET as string

export const NEXTAUTH_URL = process.env.NEXTAUTH_URL as string
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET as string

// Tipimail API credentials
export const TIPIMAIL_API_KEY = process.env.TIPIMAIL_API_KEY as string
export const TIPIMAIL_API_USER = process.env.TIPIMAIL_API_USER as string
