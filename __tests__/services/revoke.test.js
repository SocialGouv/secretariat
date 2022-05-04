import revoke from "@/services/revoke"
import { graphql, rest } from "msw"
import { setupServer } from "msw/node"

jest.mock("next-auth/react", () => ({
  getSession: () => Promise.resolve(true),
}))
jest.mock("@/utils/jwt", () => ({
  getJwt: () => "",
}))

let deleteAccountCalled = false
let deleteUserCalled = false

const server = setupServer(
  rest.delete(/github.com/, (_req, res, ctx) => {
    return res(ctx.status(550), ctx.text("fake message"))
  }),
  rest.delete(/mattermost.fabrique.social.gouv.fr/, (_req, res, ctx) => {
    return res(ctx.status(550), ctx.text("fake message"))
  }),
  rest.post(/matomo.fabrique.social.gouv.fr/, (_req, res, ctx) => {
    return res(ctx.status(550), ctx.text("fake message"))
  }),
  rest.put(/pastek.fabrique.social.gouv.fr/, (_req, res, ctx) => {
    return res(ctx.status(550), ctx.text("fake message"))
  }),
  rest.put(/nextcloud.fabrique.social.gouv.fr/, (_req, res, ctx) => {
    return res(ctx.status(550), ctx.text("fake message"))
  }),
  rest.delete(/sentry.fabrique.social.gouv.fr/, (_req, res, ctx) => {
    return res(ctx.status(550), ctx.text("fake message"))
  }),
  graphql.mutation("deleteAccount", (_req, res, ctx) => {
    deleteAccountCalled = true
    return res(
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
  server.resetHandlers()
})

describe("on account revocation", () => {
  beforeEach(() => {
    deleteAccountCalled = false
    deleteUserCalled = false
  })

  it("should delete the account on success", async () => {
    server.use(
      rest.delete(/github.com/, (_req, res, ctx) => {
        return res(ctx.status(250), ctx.text("fake message"))
      })
    )
    const { status } = await revoke(
      "fake account service ID",
      "fake account ID",
      "github"
    )
    expect(status).toEqual(250)
    expect(deleteAccountCalled).toEqual(true)
    expect(deleteUserCalled).toEqual(false)
  })

  it("should not delete the account on failure", async () => {
    const { status } = await revoke(
      "fake account service ID",
      "fake account ID",
      "github"
    )
    expect(status).toEqual(550)
    expect(deleteAccountCalled).toEqual(false)
    expect(deleteUserCalled).toEqual(false)
  })

  it("should delete the user if it has no more accounts", async () => {
    server.use(
      rest.delete(/github.com/, (_req, res, ctx) => {
        return res(ctx.status(250), ctx.text("fake message"))
      }),
      graphql.mutation("deleteAccount", (_req, res, ctx) => {
        deleteAccountCalled = true
        return res(
          ctx.data({
            delete_services_by_pk: {
              users: {
                services_aggregate: {
                  aggregate: { count: 0 },
                },
                id: "fake user ID",
              },
            },
          })
        )
      }),
      graphql.mutation("deleteUsers", (_req, res, ctx) => {
        deleteUserCalled = true
        return res(ctx.data({ affected_rows: [] }))
      })
    )
    const { status } = await revoke(
      "fake account service ID",
      "fake account ID",
      "github"
    )
    expect(status).toEqual(250)
    expect(deleteAccountCalled).toEqual(true)
    expect(deleteUserCalled).toEqual(true)
  })
})

describe("delete Github account", () => {
  it("should return status and body from service API", async () => {
    const { status, body } = await revoke(
      "fake account service ID",
      "fake account ID",
      "github"
    )
    expect(status).toEqual(550)
    expect(body).toEqual("fake message")
  })
})

describe("delete Mattermost account", () => {
  it("should return status and body from service API", async () => {
    const { status, body } = await revoke(
      "fake account service ID",
      "fake account ID",
      "mattermost"
    )
    expect(status).toEqual(550)
    expect(body).toEqual("fake message")
  })
})

describe("delete Zammad account", () => {
  it("should return status and body from service API", async () => {
    const { status, body } = await revoke(
      "fake account service ID",
      "fake account ID",
      "zammad"
    )
    expect(status).toEqual(550)
    expect(body).toEqual("fake message")
  })
})

describe("delete Sentry account", () => {
  it("should return status and body from service API", async () => {
    const { status, body } = await revoke(
      "fake account service ID",
      "fake account ID",
      "sentry"
    )
    expect(status).toEqual(550)
    expect(body).toEqual("fake message")
  })
})

describe("delete Nextcloud account", () => {
  it("should return status and body from service API", async () => {
    const { status, body } = await revoke(
      "fake account service ID",
      "fake account ID",
      "nextcloud"
    )
    expect(status).toEqual(550)
    expect(body).toEqual("fake message")
  })
})

describe("delete Matomo account", () => {
  it("should return status and body from service API", async () => {
    const { status, body } = await revoke(
      "fake account service ID",
      "fake account ID",
      "matomo"
    )
    expect(status).toEqual(550)
    expect(body).toEqual("fake message")
  })
})

describe("delete Ovh account", () => {
  it("should return status and message from exception", async () => {
    jest.mock("ovh", () => () => ({
      requestPromised: () => {
        throw { error: 550, message: "fake message" }
      },
    }))
    const { status, body } = await revoke(
      "fake account service ID",
      "fake account ID",
      "ovh"
    )
    expect(status).toEqual(550)
    expect(body).toEqual("fake message")
  })

  it("should return status 200 and empty text", async () => {
    jest.mock("ovh", () => () => ({
      requestPromised: () => {},
    }))
    const { status, body } = await revoke(
      "fake account service ID",
      "fake account ID",
      "ovh"
    )
    expect(status).toEqual(200)
    expect(body).toEqual("")
  })
})
