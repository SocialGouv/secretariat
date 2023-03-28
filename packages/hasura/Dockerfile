FROM hasura/graphql-engine:v2.19.0-ce.cli-migrations-v3

ARG APP_URL
ENV APP_URL $APP_URL

COPY --chown=hasura migrations /hasura-migrations
COPY --chown=hasura metadata /hasura-metadata

USER 1001
