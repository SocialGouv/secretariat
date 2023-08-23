import { graphql, rest } from "msw"

import { users } from "./data"

export const handlers = [
  rest.get("http://localhost/test", (_req, res, ctx) =>
    res(ctx.json(["test result"]))
  ),
  rest.get("http://localhost:3000/api/jwt", (_req, res, ctx) =>
    res(ctx.json({ token: "1234" }))
  ),
  graphql.query("getUsers", (_req, res, ctx) => res(ctx.data({ users }))),
  graphql.mutation("insertService", (_req, res, ctx) =>
    res(
      ctx.data({
        insert_services_one: {
          id: "1",
        },
      })
    )
  ),
  graphql.mutation("insertUser", (_req, res, ctx) =>
    res(
      ctx.data({
        insert_users_one: {
          id: "insertedUserId",
        },
      })
    )
  ),
  graphql.mutation("updateService", (_req, res, ctx) =>
    res(
      ctx.data({
        update_services_by_pk: {
          id: "updatedServiceId",
        },
      })
    )
  ),
  graphql.mutation("deleteServicesNotIn", (_req, res, ctx) =>
    res(
      ctx.data({
        delete_services: {
          returning: [],
        },
      })
    )
  ),
  graphql.mutation("deleteServices", (_req, res, ctx) =>
    res(
      ctx.data({
        delete_services: {
          returning: [],
        },
      })
    )
  ),
  graphql.mutation("deleteUsers", (_req, res, ctx) =>
    res(
      ctx.data({
        delete_users: {
          affected_rows: 0,
        },
      })
    )
  ),
  graphql.query("getServicesMatchingId", (_req, res, ctx) =>
    res(
      ctx.data({
        services: [],
      })
    )
  ),
  graphql.mutation("updateOnboardingRequest", (_req, res, ctx) =>
    res(
      ctx.data({
        insert_onboarding_requests_one: {
          id: "1",
        },
      })
    )
  ),
  graphql.query("getOnboardingRequest", (_req, res, ctx) =>
    res(ctx.data({ onboarding_requests: [{ reviewed: null }] }))
  ),
  graphql.mutation("confirmOnboardingRequest", (_req, res, ctx) =>
    res(
      ctx.data({
        update_onboarding_requests: {
          affected_rows: 1,
          returning: [
            {
              data: { firstName: "fake firstname", lastName: "fake lastname" },
            },
          ],
        },
      })
    )
  ),
  rest.post(/github.com/, (_req, res, ctx) =>
    res(ctx.status(250), ctx.json({ data: "fake data" }))
  ),
  rest.get(/github.com/, (_req, res, ctx) =>
    res(ctx.status(200), ctx.json({ id: "fake id" }))
  ),
  rest.post(/mattermost.fabrique.social.gouv.fr/, (_req, res, ctx) =>
    res(ctx.status(250), ctx.json({ data: "fake data" }))
  ),
  graphql.mutation("insertService", (_req, res, ctx) =>
    res(
      ctx.data({
        insert_services_one: {
          id: "1",
        },
      })
    )
  ),
  graphql.mutation("createOnboardingRequest", (_req, res, ctx) =>
    res(
      ctx.data({
        insert_onboarding_requests_one: {
          id: "1",
        },
      })
    )
  ),
  graphql.query("getOnboardingRequestContaining", (_req, res, ctx) =>
    res(
      ctx.data({
        onboarding_requests: [],
      })
    )
  ),
  rest.delete(/github.com/, (_req, res, ctx) =>
    res(ctx.status(550), ctx.text("fake message"))
  ),
  rest.delete(/mattermost.fabrique.social.gouv.fr/, (_req, res, ctx) =>
    res(ctx.status(550), ctx.text("fake message"))
  ),
  rest.post(/matomo.fabrique.social.gouv.fr/, (_req, res, ctx) =>
    res(ctx.status(550), ctx.text("fake message"))
  ),
  rest.put(/pastek.fabrique.social.gouv.fr/, (_req, res, ctx) =>
    res(ctx.status(550), ctx.text("fake message"))
  ),
  rest.put(/nextcloud.fabrique.social.gouv.fr/, (_req, res, ctx) =>
    res(ctx.status(550), ctx.text("fake message"))
  ),
  rest.delete(/sentry.fabrique.social.gouv.fr/, (_req, res, ctx) =>
    res(ctx.status(550), ctx.text("fake message"))
  ),
  graphql.mutation("deleteAccount", (_req, res, ctx) =>
    res(
      ctx.data({
        delete_services_by_pk: {
          users: {
            services_aggregate: {
              aggregate: { count: 2 },
            },
            id: "fake user ID",
          },
        },
      })
    )
  ),
  graphql.query("getReviewedOnboardingRequestContaining", (_req, res, ctx) =>
    res(ctx.data({ onboarding_requests: [] }))
  ),
  graphql.mutation("enableUsersByServicesIds", (_req, res, ctx) =>
    res(
      ctx.data({
        update_users: {
          affected_rows: 0,
        },
      })
    )
  ),
]
