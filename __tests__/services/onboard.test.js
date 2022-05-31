import onboard from "@/services/onboard"
import ovh from "@/utils/ovh"
import { rest } from "msw"
import { setupServer } from "msw/node"

jest.mock("@/utils/ovh")
const server = setupServer(
  rest.post(/github.com/, (_req, res, ctx) => {
    return res(ctx.status(250), ctx.json({ data: "fake data" }))
  }),
  rest.get(/github.com/, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ id: "fake id" }))
  }),
  rest.post(/mattermost.fabrique.social.gouv.fr/, (_req, res, ctx) => {
    return res(ctx.status(250), ctx.json({ data: "fake data" }))
  })
)

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" })
})

afterAll(() => {
  server.close()
})

it("should return only github if no services", async () => {
  expect(
    await onboard({
      services: {},
      firstName: "fake firstname",
      lastName: "fake lastname",
    })
  ).toStrictEqual({ github: { status: 250, body: { data: "fake data" } } })
})

it("should return status and body from each API", async () => {
  ovh
    .mockResolvedValueOnce({ success: true, data: ["fake@fake.fake"] })
    .mockResolvedValue({ success: true, data: "fake data" })
  expect(
    await onboard({
      services: { github: {}, mattermost: {}, ovh: {} },
      firstName: "fake firstname",
      lastName: "fake lastname",
    })
  ).toStrictEqual({
    ovh: { status: 200, body: "fake data" },
    github: { status: 250, body: { data: "fake data" } },
    mattermost: { status: 250, body: { data: "fake data" } },
  })
})

describe("ovh error", () => {
  it("should handle error on first query", async () => {
    ovh.mockResolvedValue({
      success: false,
      error: { error: 550, message: "fake message" },
    })
    expect(
      await onboard({
        services: { ovh: {} },
        firstName: "fake firstname",
        lastName: "fake lastname",
      })
    ).toStrictEqual({
      ovh: { status: 550, body: "fake message" },
      github: { status: 250, body: { data: "fake data" } },
    })
  })

  it("should handle error on second query", async () => {
    ovh
      .mockResolvedValueOnce({ success: true, data: ["fake@fake.fake"] })
      .mockResolvedValue({
        success: false,
        error: { error: 550, message: "fake message" },
      })
    expect(
      await onboard({
        services: { ovh: {} },
        firstName: "fake firstname",
        lastName: "fake lastname",
      })
    ).toStrictEqual({
      ovh: { status: 550, body: "fake message" },
      github: { status: 250, body: { data: "fake data" } },
    })
  })
})
