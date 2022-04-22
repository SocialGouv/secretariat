import { graphql, rest } from "msw"

const users = [
  {
    id: "1",
    name: "user1",
    email: "user1@paradise.sky",
    warnings: [],
    services: [
      {
        id: "11",
        type: "nextcloud",
        data: {
          lastLogin: "",
          displayname: "User 1",
          email: "user1@paradise.sky",
        },
      },
    ],
  },
  {
    id: "2",
    name: "user2",
    email: "user2@paradise.sky",
    warnings: [],
    services: [
      {
        id: "12",
        type: "nextcloud",
        data: {
          lastLogin: "",
          displayname: "User 2",
          email: "user2@paradise.sky",
        },
      },
    ],
  },
]

export const handlers = [
  rest.get("http://localhost/test", (_req, res, ctx) =>
    res(ctx.json(["test result"]))
  ),
  rest.get("http://localhost:3000/api/jwt", (_req, res, ctx) =>
    res(ctx.json({ token: "1234" }))
  ),
  graphql.query("getUsers", (_req, res, ctx) => res(ctx.data({ users }))),
]
