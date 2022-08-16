CREATE TABLE "public"."logs" ("id" serial NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "user" text NOT NULL, "route" text NOT NULL, "body" jsonb, PRIMARY KEY ("id") );
