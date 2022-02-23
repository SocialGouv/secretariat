CREATE OR REPLACE VIEW "public"."services_count" AS 
 SELECT 
    jsonb_array_length(services.github) AS github,
    jsonb_array_length(services.sentry) AS sentry,
    jsonb_array_length(services.matomo) AS matomo,
    jsonb_array_length(services.ovh) AS ovh,
    jsonb_array_length(services.mattermost) AS mattermost,
    jsonb_array_length(services.zammad) AS zammad,
    jsonb_array_length(services.nextcloud) AS nextcloud,
    (SELECT count(*) FROM users) AS users
   FROM services;