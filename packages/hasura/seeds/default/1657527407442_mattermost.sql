SET check_function_bodies = false;

INSERT INTO public.users (id, updated_at, arrival, departure) VALUES ('d5c2da59-2fdf-4a8b-9d47-c4428ceb994d', '2022-07-11 08:11:06.042886+00', NULL, NULL);
INSERT INTO public.users (id, updated_at, arrival, departure) VALUES ('d0133111-7b32-45bb-a139-dd72491a40c4', '2022-07-11 08:11:06.076441+00', NULL, NULL);
INSERT INTO public.users (id, updated_at, arrival, departure) VALUES ('cecb5664-6ac5-49c2-aad9-cbd6a4f35d73', '2022-07-11 08:11:06.108355+00', NULL, NULL);
INSERT INTO public.users (id, updated_at, arrival, departure) VALUES ('948d55a0-7cba-4a94-b577-26242dabdc72', '2022-07-11 08:11:06.140528+00', NULL, NULL);
INSERT INTO public.users (id, updated_at, arrival, departure) VALUES ('f0e8bae1-61c1-443e-89a4-b8e79c530a46', '2022-07-11 08:11:06.173016+00', NULL, NULL);

INSERT INTO public.services (id, updated_at, user_id, type, data) VALUES ('fdea5f7b-0185-438a-b703-54a121598a68', '2022-07-11 08:11:06.05+00', 'd5c2da59-2fdf-4a8b-9d47-c4428ceb994d', 'mattermost', '{
    "id": "abc1",
    "email": "user1@mail.com",
    "roles": "system_user",
    "teams": [],
    "locale": "fr",
    "nickname": "",
    "position": "",
    "timezone": {
        "manualTimezone": "",
        "automaticTimezone": "Europe/Paris",
        "useAutomaticTimezone": "true"
    },
    "username": "user1",
    "auth_data": "",
    "create_at": 1592237463564,
    "delete_at": 0,
    "last_name": "1",
    "update_at": 1623419879770,
    "first_name": "User",
    "auth_service": "",
    "disable_welcome_email": false
}');
INSERT INTO public.services (id, updated_at, user_id, type, data) VALUES ('c65e8c7c-ff96-4f91-aaec-0e76fbd8cedb', '2022-07-11 08:11:06.08+00', 'd0133111-7b32-45bb-a139-dd72491a40c4', 'mattermost', '{
    "id": "abc2",
    "email": "user2@mail.com",
    "roles": "",
    "teams": [],
    "locale": "fr",
    "nickname": "",
    "position": "",
    "timezone": {
        "manualTimezone": "",
        "automaticTimezone": "Europe/Paris",
        "useAutomaticTimezone": "true"
    },
    "username": "user2",
    "auth_data": "",
    "create_at": 1592237463564,
    "delete_at": 0,
    "last_name": "2",
    "update_at": 1623419879770,
    "first_name": "User",
    "auth_service": "",
    "disable_welcome_email": false
}');
INSERT INTO public.services (id, updated_at, user_id, type, data) VALUES ('4db68a73-14e5-4196-bde3-92ae90d88350', '2022-07-11 08:11:06.11+00', 'cecb5664-6ac5-49c2-aad9-cbd6a4f35d73', 'mattermost', '{
    "id": "abc3",
    "email": "user3@mail.com",
    "roles": "system_user",
    "teams": [],
    "locale": "fr",
    "nickname": "",
    "position": "",
    "timezone": {
        "manualTimezone": "",
        "automaticTimezone": "Europe/Paris",
        "useAutomaticTimezone": "true"
    },
    "username": "user3",
    "auth_data": "",
    "create_at": 1592237463564,
    "delete_at": 0,
    "last_name": "3",
    "update_at": 1623419879770,
    "first_name": "User",
    "auth_service": "",
    "disable_welcome_email": false
}');
INSERT INTO public.services (id, updated_at, user_id, type, data) VALUES ('05f01e3f-0a8e-4f33-9547-d6a0d743639e', '2022-07-11 08:11:06.15+00', '948d55a0-7cba-4a94-b577-26242dabdc72', 'mattermost', '{
    "id": "abc4",
    "email": "user4@mail.com",
    "roles": "",
    "teams": [],
    "locale": "fr",
    "nickname": "",
    "position": "",
    "timezone": {
        "manualTimezone": "",
        "automaticTimezone": "Europe/Paris",
        "useAutomaticTimezone": "true"
    },
    "username": "user4",
    "auth_data": "",
    "create_at": 1592237463564,
    "delete_at": 0,
    "last_name": "4",
    "update_at": 1623419879770,
    "first_name": "User",
    "auth_service": "",
    "disable_welcome_email": true
}');
INSERT INTO public.services (id, updated_at, user_id, type, data) VALUES ('ec8bc92c-c9d4-4388-90f7-63f3598b0ecc', '2022-07-11 08:11:06.18+00', 'f0e8bae1-61c1-443e-89a4-b8e79c530a46', 'mattermost', '{
    "id": "abc5",
    "email": "user5@mail.com",
    "roles": "system_user",
    "teams": [],
    "locale": "fr",
    "nickname": "",
    "position": "",
    "timezone": {
        "manualTimezone": "",
        "automaticTimezone": "Europe/Paris",
        "useAutomaticTimezone": "true"
    },
    "username": "user5",
    "auth_data": "",
    "create_at": 1592237463564,
    "delete_at": 0,
    "last_name": "5",
    "update_at": 1623419879770,
    "first_name": "User",
    "auth_service": "",
    "disable_welcome_email": false
}');
