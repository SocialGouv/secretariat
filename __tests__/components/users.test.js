import { useSession } from "next-auth/react"
import { act, render } from "@testing-library/react"

import Users from "../../src/components/users"

// https://github.com/nextauthjs/next-auth/issues/775
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}))

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

// import { rest } from "msw"
// export const handlers = [
//   rest.post("http://localhost:8080/v1/graphql", (req, res, ctx) => {
//     return res(ctx.json(users))
//   }),
// ]

import { graphql } from "msw"
export const handlers = [
  graphql.query("getUsers", (req, res, ctx) => {
    return res(ctx.data({ users }))
  }),
]

import { setupServer } from "msw/node"
export const server = setupServer(...handlers)

beforeAll(() => server.listen())

import { cache, SWRConfig } from "swr"
afterEach(() => {
  cache && cache.clear()
  server.resetHandlers()
})

afterAll(() => server.close())

const fetcher = () => {
  console.log("FETCHER")
  // return Promise.resolve(users)
  return users[0]
}

it("renders users", () => {
  useSession.mockReturnValueOnce([false, false])
  let container
  act(() => {
    const { container: c } = render(
      <SWRConfig
        value={{ provider: () => new Map(), dedupingInterval: 0, fetcher }}
      >
        <Users />
      </SWRConfig>
    )
    container = c
  })
  expect(container).toMatchSnapshot()
})
