SET check_function_bodies = false;
INSERT INTO public.onboarding_requests (id, created_at, data, confirmed, reviewed) VALUES ('60493629-3fa1-4ad5-afa9-b99ebf3fb99e', '2022-07-13 11:14:14.755981+00', '{"email": "user.a@mail.com", "arrival": "2022-07-13", "message": "Bonjour, je suis User A et je rejoins la Fabrique.", "lastName": "A", "services": {"ovh": true, "mattermost": true}, "departure": "2022-07-31", "firstName": "User", "githubLogin": "user-a"}', true, true);
INSERT INTO public.onboarding_requests (id, created_at, data) VALUES ('e6d248eb-c1de-41dd-89e6-9419de7b02fe', '2022-07-13 11:16:32.645595+00', '{"email": "user.c@mail.com", "arrival": "2022-07-13", "message": "User C", "lastName": "C", "services": {"ovh": false, "mattermost": false}, "departure": "2022-07-18", "firstName": "User", "githubLogin": "userC"}');
INSERT INTO public.onboarding_requests (id, created_at, data, confirmed) VALUES ('74504381-3fb5-40a5-81d6-3a1d382afcb8', '2022-07-13 11:15:28.29303+00', '{"email": "user-b@mail.com", "arrival": "2022-07-13", "message": "Je suis User B.", "lastName": "B", "services": {"ovh": false, "mattermost": true}, "departure": "2022-07-19", "firstName": "User", "githubLogin": "userB"}', true);
