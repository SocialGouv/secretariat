import { graphql, http, HttpResponse } from "msw"

import { users } from "./data"

export const handlers = [
  http.get("http://localhost/test", () => HttpResponse.json(["test result"])),
  http.get("http://localhost:3000/api/jwt", () =>
    HttpResponse.json({ token: "1234" })
  ),
  graphql.query("getUsers", () => HttpResponse.json({ data: { users } })),
  graphql.mutation("insertService", () =>
    HttpResponse.json({
      data: {
        insert_services_one: {
          id: "1",
        },
      },
    })
  ),
  graphql.mutation("insertUser", () =>
    HttpResponse.json({
      data: {
        insert_users_one: {
          id: "insertedUserId",
        },
      },
    })
  ),
  graphql.mutation("updateService", () =>
    HttpResponse.json({
      data: {
        update_services_by_pk: {
          id: "updatedServiceId",
        },
      },
    })
  ),
  graphql.mutation("deleteServicesNotIn", () =>
    HttpResponse.json({
      data: {
        delete_services: {
          returning: [],
        },
      },
    })
  ),
  graphql.mutation("deleteServices", () =>
    HttpResponse.json({
      data: {
        delete_services: {
          returning: [],
        },
      },
    })
  ),
  graphql.mutation("deleteUsers", () =>
    HttpResponse.json({
      data: {
        delete_users: {
          affected_rows: 0,
        },
      },
    })
  ),
  graphql.query("getServicesMatchingId", () =>
    HttpResponse.json({
      data: {
        services: [],
      },
    })
  ),
  graphql.mutation("updateOnboardingRequest", () =>
    HttpResponse.json({
      data: {
        insert_onboarding_requests_one: {
          id: "1",
        },
      },
    })
  ),
  graphql.query("getOnboardingRequest", () =>
    HttpResponse.json({ data: { onboarding_requests: [{ reviewed: null }] } })
  ),
  graphql.mutation("confirmOnboardingRequest", () =>
    HttpResponse.json({
      data: {
        update_onboarding_requests: {
          affected_rows: 1,
          returning: [
            {
              data: { firstName: "fake firstname", lastName: "fake lastname" },
            },
          ],
        },
      },
    })
  ),
  http.post(/github.com/, () =>
    HttpResponse.json({ data: "fake data" }, { status: 250 })
  ),
  http.get(/github.com/, () => HttpResponse.json({ id: "fake id" })),
  http.post(/mattermost.fabrique.social.gouv.fr/, () =>
    HttpResponse.json({ data: "fake data" }, { status: 250 })
  ),
  graphql.mutation("insertService", () =>
    HttpResponse.json({
      data: {
        insert_services_one: {
          id: "1",
        },
      },
    })
  ),
  graphql.mutation("createOnboardingRequest", () =>
    HttpResponse.json({
      data: {
        insert_onboarding_requests_one: {
          id: "1",
        },
      },
    })
  ),
  graphql.query("getOnboardingRequestContaining", () =>
    HttpResponse.json({
      data: {
        onboarding_requests: [],
      },
    })
  ),
  http.delete(/github.com/, () =>
    HttpResponse.text("fake message", { status: 550 })
  ),
  http.delete(/mattermost.fabrique.social.gouv.fr/, () =>
    HttpResponse.text("fake message", { status: 550 })
  ),
  http.post(/matomo.fabrique.social.gouv.fr/, () =>
    HttpResponse.text("fake message", { status: 550 })
  ),
  http.put(/pastek.fabrique.social.gouv.fr/, () =>
    HttpResponse.text("fake message", { status: 550 })
  ),
  http.put(/nextcloud.fabrique.social.gouv.fr/, () =>
    HttpResponse.text("fake message", { status: 550 })
  ),
  http.delete(/sentry.fabrique.social.gouv.fr/, () =>
    HttpResponse.text("fake message", { status: 550 })
  ),
  graphql.mutation("deleteAccount", () =>
    HttpResponse.json({
      data: {
        delete_services_by_pk: {
          users: {
            services_aggregate: {
              aggregate: { count: 2 },
            },
            id: "fake user ID",
          },
        },
      },
    })
  ),
  graphql.query("getReviewedOnboardingRequestContaining", () =>
    HttpResponse.json({ data: { onboarding_requests: [] } })
  ),
  graphql.mutation("enableUsersByServicesIds", () =>
    HttpResponse.json({
      data: {
        update_users: {
          affected_rows: 0,
        },
      },
    })
  ),
]
