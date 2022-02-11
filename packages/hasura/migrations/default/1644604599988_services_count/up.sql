CREATE VIEW services_count AS
SELECT
    jsonb_array_length(github) AS github,
    jsonb_array_length(sentry) AS sentry,
    jsonb_array_length(matomo) AS matomo,
    jsonb_array_length(ovh) AS ovh,
    jsonb_array_length(mattermost) AS mattermost,
    jsonb_array_length(zammad) AS zammad,
    jsonb_array_length(nextcloud) AS nextcloud
FROM services;
