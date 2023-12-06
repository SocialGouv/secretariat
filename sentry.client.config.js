import * as Sentry from "@sentry/nextjs"

Sentry.init({
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
})
