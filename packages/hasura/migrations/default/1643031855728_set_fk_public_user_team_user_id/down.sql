alter table "public"."user_team" drop constraint "user_team_user_id_fkey",
  add constraint "user_teams_user_id_fkey"
  foreign key ("user_id")
  references "public"."users"
  ("id") on update restrict on delete restrict;
