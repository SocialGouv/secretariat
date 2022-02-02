# Rebuild the source code only when needed
FROM node:16.13-alpine AS builder
ARG NEXT_PUBLIC_HASURA_URL
ENV NEXT_PUBLIC_HASURA_URL $NEXT_PUBLIC_HASURA_URL
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

# Production image, copy all the files and run next
FROM node:16.13-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER 1001

EXPOSE 3000

ENV PORT 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["node_modules/.bin/next", "start"]