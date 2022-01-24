alter table "public"."github_usernames" drop constraint "github_usernames_user_id_fkey",
  add constraint "github_usernames_user_id_fkey"
  foreign key ("user_id")
  references "public"."users"
  ("id") on update cascade on delete cascade;
