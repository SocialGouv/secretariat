CREATE TABLE "public"."services" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "github" jsonb NOT NULL, "mattermost" JSONB NOT NULL, "ovh" JSONB NOT NULL, "matomo" JSONB NOT NULL, "sentry" JSONB NOT NULL, "zammad" JSONB NOT NULL, "nextcloud" JSONB NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
