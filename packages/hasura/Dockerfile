FROM hasura/graphql-engine:v2.19.0-ce.cli-migrations-v3

ARG APP_URL
ENV APP_URL $APP_URL

COPY --chown=1001 migrations /hasura-migrations
COPY --chown=1001 metadata /hasura-metadata

USER 1001
