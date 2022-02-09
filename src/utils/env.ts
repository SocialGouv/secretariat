const checkEnv = (name: string) => {
  if (!process.env[name]) {
    throw ReferenceError(`Could not find ${name} environment variable`)
  }
  return process.env[name] as string
}

// Hasura backend's URL
export const NEXT_PUBLIC_HASURA_URL = checkEnv("NEXT_PUBLIC_HASURA_URL")

// Private key to sign JWTs for Hasura
export const HASURA_JWT_KEY = checkEnv("HASURA_JWT_KEY")

// Services tokens
export const MATOMO_API_TOKEN = checkEnv("MATOMO_API_TOKEN")
export const SENTRY_API_TOKEN = checkEnv("SENTRY_API_TOKEN")
export const OVH_APP_KEY = checkEnv("OVH_APP_KEY")
export const OVH_APP_SECRET = checkEnv("OVH_APP_SECRET")
export const OVH_CONSUMER_KEY = checkEnv("OVH_CONSUMER_KEY")
export const OVH_SERVICE_NAME = checkEnv("OVH_SERVICE_NAME")
export const ZAMMAD_API_TOKEN = checkEnv("ZAMMAD_API_TOKEN")
export const NEXTCLOUD_API_LOGIN = checkEnv("NEXTCLOUD_API_LOGIN")
export const NEXTCLOUD_API_SECRET = checkEnv("NEXTCLOUD_API_SECRET")
export const MATTERMOST_API_TOKEN = checkEnv("MATTERMOST_API_TOKEN")

// Github sends this to authenticate its webhook
export const GITHUB_WEBHOOK_SECRET = checkEnv("GITHUB_WEBHOOK_SECRET")

// Github auth provider
export const GITHUB_ID = checkEnv("GITHUB_ID")
export const GITHUB_SECRET = checkEnv("GITHUB_SECRET")

export const NEXTAUTH_SECRET = checkEnv("NEXTAUTH_SECRET")
