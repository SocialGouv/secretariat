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
]
