CREATE TABLE "public"."onboarding_requests" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "data" jsonb NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"));COMMENT ON TABLE "public"."onboarding_requests" IS E'All onboarding requests';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
