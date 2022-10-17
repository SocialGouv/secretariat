ALTER TABLE onboarding_requests
ALTER COLUMN reviewed
DROP NOT NULL;
ALTER TABLE onboarding_requests
ALTER COLUMN reviewed
SET DEFAULT NULL;
ALTER TABLE onboarding_requests
ALTER COLUMN reviewed
TYPE JSONB
USING (CASE WHEN reviewed='true' THEN json_build_object('date', null, 'author', null) ELSE NULL END);
