
alter table "public"."users2" alter column "warning" drop not null;
alter table "public"."users2" add column "warning" text;

DROP TABLE "public"."services";

DROP TABLE "public"."users2";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."users" add column "departure" date
--  null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."users" add column "arrival" date
--  null;
