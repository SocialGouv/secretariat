alter table "public"."user_team" drop constraint "user_teams_team_name_fkey",
  add constraint "user_team_team_name_fkey"
  foreign key ("team_name")
  references "public"."teams"
  ("name") on update cascade on delete cascade;
