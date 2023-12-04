FROM node:20-alpine as base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Rebuild the source code only when needed
FROM base AS builder

# install deps
COPY yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
RUN yarn fetch --immutable

COPY . .

# build time args
ARG NEXT_PUBLIC_HASURA_URL
ENV NEXT_PUBLIC_HASURA_URL $NEXT_PUBLIC_HASURA_URL
ARG NEXT_PUBLIC_MATOMO_URL
ENV NEXT_PUBLIC_MATOMO_URL $NEXT_PUBLIC_MATOMO_URL
ARG NEXT_PUBLIC_MATOMO_SITE_ID
ENV NEXT_PUBLIC_MATOMO_SITE_ID $NEXT_PUBLIC_MATOMO_SITE_ID
ARG SENTRY_ENVIRONMENT
ENV SENTRY_ENVIRONMENT $SENTRY_ENVIRONMENT
ARG SENTRY_RELEASE
ENV SENTRY_RELEASE $SENTRY_RELEASE
ARG SENTRY_DSN
ENV SENTRY_DSN $SENTRY_DSN
ENV NEXT_TELEMETRY_DISABLED 1

# build
RUN --mount=type=secret,id=sentry_auth_token export SENTRY_AUTH_TOKEN="$(cat /run/secrets/sentry_auth_token)"; \
  yarn build

# Production image, copy all the files and run next
FROM base AS runner

ARG SENTRY_ENVIRONMENT
ENV SENTRY_ENVIRONMENT $SENTRY_ENVIRONMENT
ARG SENTRY_RELEASE
ENV SENTRY_RELEASE $SENTRY_RELEASE
ARG SENTRY_DSN
ENV SENTRY_DSN $SENTRY_DSN

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER 1001
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
