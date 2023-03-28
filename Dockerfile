# Install dependencies only when needed
FROM node:16-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

ARG NEXT_PUBLIC_HASURA_URL
ENV NEXT_PUBLIC_HASURA_URL $NEXT_PUBLIC_HASURA_URL
ARG NEXT_PUBLIC_MATOMO_URL
ENV NEXT_PUBLIC_MATOMO_URL $NEXT_PUBLIC_MATOMO_URL
ARG NEXT_PUBLIC_MATOMO_SITE_ID
ENV NEXT_PUBLIC_MATOMO_SITE_ID $NEXT_PUBLIC_MATOMO_SITE_ID
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

USER 1001
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
