FROM node:16 as builder

WORKDIR /usr/src/frontend
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM ghcr.io/socialgouv/docker/nginx4spa:6.70.0
COPY --from=builder /usr/src/frontend/build /usr/share/nginx/html
