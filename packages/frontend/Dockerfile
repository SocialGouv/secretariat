FROM node:15.9-alpine as builder

COPY . .

RUN npm run build

FROM ghcr.io/socialgouv/docker/nginx4spa:6.70.0

COPY --from=builder /build /usr/share/nginx/html