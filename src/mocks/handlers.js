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
]
