alter table "public"."users2" alter column "warning" drop not null;
alter table "public"."users2" add column "warning" text;
