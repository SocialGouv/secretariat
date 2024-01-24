FROM hasura/graphql-engine:v2.19.0-ce.cli-migrations-v3

COPY --chown=1001 migrations /hasura-migrations
COPY --chown=1001 metadata /hasura-metadata

USER 1001
