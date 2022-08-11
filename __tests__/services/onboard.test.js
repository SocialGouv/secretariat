import onboard from "@/services/onboard"
import ovh from "@/utils/ovh"
import sluggifyString from "@/utils/sluggify-string"
import { rest, graphql } from "msw"
import { setupServer } from "msw/node"

jest.mock("@/utils/jwt", () => ({
  getJwt: () => "",
}))
jest.mock("@/utils/ovh")

let insertUserCalledWith
const server = setupServer(
  rest.post(/github.com/, (_req, res, ctx) => {
    return res(ctx.status(250), ctx.json({ data: "fake data" }))
  }),
  rest.get(/github.com/, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ id: "fake id" }))
  }),
  rest.post(/mattermost.fabrique.social.gouv.fr/, (_req, res, ctx) => {
    return res(ctx.status(250), ctx.json({ data: "fake data" }))
  }),
  graphql.mutation("insertService", (_req, res, ctx) => {
    return res(
      ctx.data({
        insert_services_one: {
          id: "1",
        },
      })
    )
  }),
  graphql.mutation("insertUser", (req, res, ctx) => {
    insertUserCalledWith = req.variables
    return res(
      ctx.data({
        insert_users_one: {
          id: "fake id",
        },
      })
    )
  })
)

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" })
})

afterAll(() => {
  server.close()
})

beforeEach(() => {
  jest.resetModules()
  insertUserCalledWith = null
})

it("should return empty if no services", async () => {
  expect(
    await onboard({
      services: { mattermost: false, ovh: false },
      firstName: "fake firstname",
      lastName: "fake lastname",
      githubLogin: "",
    })
  ).toStrictEqual({})
})

it("should return status and body from each API", async () => {
  expect(
    await onboard({
      services: { mattermost: true, ovh: false },
      firstName: "fake firstname",
      lastName: "fake lastname",
      githubLogin: "fake github",
    })
  ).toStrictEqual({
    github: { status: 250, body: { data: "fake data" } },
    mattermost: { status: 250, body: { data: "fake data" } },
  })
})

it("should return status, body and login/password for ovh account", async () => {
  ovh
    .mockResolvedValueOnce({ success: true, data: ["fake@fake.fake"] })
    .mockResolvedValue({ success: true, data: "fake data" })

  const response = await onboard({
    services: { mattermost: false, ovh: true },
    firstName: "fake firstname",
    lastName: "fake lastname",
    githubLogin: "",
  })
  expect(response).toMatchObject({
    ovh: {
      status: 200,
      body: "fake data",
      mailInfo: {
        login: `${sluggifyString("fake firstname")}.${sluggifyString(
          "fake lastname"
        )}`,
      },
    },
  })
  expect(response.ovh.mailInfo).toHaveProperty("password")
})

it("should insert user and account on success", async () => {
  await onboard({
    services: { mattermost: true, ovh: false },
    firstName: "fake firstname",
    lastName: "fake lastname",
    githubLogin: "",
    arrival: "01-01-2022",
    departure: "01-05-2022",
  })
  expect(insertUserCalledWith).toStrictEqual({
    user: {
      arrival: "01-01-2022",
      departure: "01-05-2022",
    },
  })
})

describe("ovh error", () => {
  it("should handle error on query 1", async () => {
    ovh.mockResolvedValue({
      success: false,
      error: { error: 550, message: "fake message" },
    })
    expect(
      await onboard({
        services: { ovh: true, mattermost: false },
        firstName: "fake firstname",
        lastName: "fake lastname",
        githubLogin: "",
      })
    ).toStrictEqual({
      ovh: { status: 550, body: "fake message" },
    })
  })
  it("should handle error on query 3", async () => {
    ovh
      .mockResolvedValueOnce({ success: true, data: ["fake@fake.fake"] })
      .mockResolvedValue({
        success: false,
        error: { error: 550, message: "fake message" },
      })
    expect(
      await onboard({
        services: { ovh: true, mattermost: false },
        firstName: "fake firstname",
        lastName: "fake lastname",
        githubLogin: "",
      })
    ).toStrictEqual({
      ovh: { status: 550, body: "fake message" },
    })
  })
  it("should handle error on query 3", async () => {
    ovh
      .mockResolvedValueOnce({ success: true, data: ["fake@fake.fake"] })
      .mockResolvedValueOnce({ success: true, data: "fake data" })
      .mockResolvedValue({
        success: false,
        error: { error: 550, message: "fake message" },
      })
    expect(
      await onboard({
        services: { ovh: true, mattermost: false },
        firstName: "fake firstname",
        lastName: "fake lastname",
        githubLogin: "",
      })
    ).toStrictEqual({
      ovh: { status: 550, body: "fake message" },
    })
  })
})
