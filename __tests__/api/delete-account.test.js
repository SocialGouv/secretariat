import { rest } from "msw"
import { setupServer } from "msw/node"
import { createMocks } from "node-mocks-http"
import handleDeleteGithubAccount from "../../src/pages/api/delete-account/github/[userLogin]"
import handleDeleteMatomoAccount from "../../src/pages/api/delete-account/matomo/[userLogin]"
import handleDeleteMattermostAccount from "../../src/pages/api/delete-account/mattermost/[userID]"
import handleDeleteNextcloudAccount from "../../src/pages/api/delete-account/nextcloud/[userID]"
import handleDeleteOvhAccount from "../../src/pages/api/delete-account/ovh/[email]"
import handleDeleteSentryAccount from "../../src/pages/api/delete-account/sentry/[userID]"
import handleDeleteZammadAccount from "../../src/pages/api/delete-account/zammad/[userID]"

jest.mock("next-auth/react", () => ({
  getSession: () => Promise.resolve(true),
}))

const server = setupServer(
  rest.delete(/github.com/, (req, res, ctx) => {
    return res(ctx.status(100), ctx.text("fake message"))
  }),
  rest.delete(/mattermost.fabrique.social.gouv.fr/, (req, res, ctx) => {
    return res(ctx.status(100), ctx.text("fake message"))
  }),
  rest.post(/matomo.fabrique.social.gouv.fr/, (req, res, ctx) => {
    return res(ctx.status(100), ctx.text("fake message"))
  }),
  rest.put(/pastek.fabrique.social.gouv.fr/, (req, res, ctx) => {
    return res(ctx.status(100), ctx.text("fake message"))
  }),
  rest.put(/nextcloud.fabrique.social.gouv.fr/, (req, res, ctx) => {
    return res(ctx.status(100), ctx.text("fake message"))
  }),
  rest.delete(/sentry.fabrique.social.gouv.fr/, (req, res, ctx) => {
    return res(ctx.status(100), ctx.text("fake message"))
  })
)

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" })
})

afterAll(() => {
  server.close()
})

let req, res
beforeEach(() => {
  jest.resetModules()
  ;({ req, res } = createMocks({
    method: "GET",
    query: {
      userLogin: "fake user",
      userID: "fake user",
      email: "fake user",
    },
  }))
})

describe("delete Github account", () => {
  it("should return status and body from service API", async () => {
    await handleDeleteGithubAccount(req, res)
    expect(res._getStatusCode()).toEqual(100)
    expect(res._getData()).toEqual("fake message")
  })
})

describe("delete Mattermost account", () => {
  it("should return status and body from service API", async () => {
    await handleDeleteMattermostAccount(req, res)
    expect(res._getStatusCode()).toEqual(100)
    expect(res._getData()).toEqual("fake message")
  })
})

describe("delete Zammad account", () => {
  it("should return status and body from service API", async () => {
    await handleDeleteZammadAccount(req, res)
    expect(res._getStatusCode()).toEqual(100)
    expect(res._getData()).toEqual("fake message")
  })
})

describe("delete Sentry account", () => {
  it("should return status and body from service API", async () => {
    await handleDeleteSentryAccount(req, res)
    expect(res._getStatusCode()).toEqual(100)
    expect(res._getData()).toEqual("fake message")
  })
})

describe("delete Nextcloud account", () => {
  it("should return status and body from service API", async () => {
    await handleDeleteNextcloudAccount(req, res)
    expect(res._getStatusCode()).toEqual(100)
    expect(res._getData()).toEqual("fake message")
  })
})

describe("delete Matomo account", () => {
  it("should return status and body from service API", async () => {
    await handleDeleteMatomoAccount(req, res)
    expect(res._getStatusCode()).toEqual(100)
    expect(res._getData()).toEqual("fake message")
  })
})

describe("delete Ovh account", () => {
  it("should return status and message from exception", async () => {
    jest.mock("ovh", () => () => ({
      requestPromised: () => {
        throw { error: 500, message: "fake message" }
      },
    }))
    await handleDeleteOvhAccount(req, res)
    expect(res._getStatusCode()).toEqual(500)
    expect(res._getData()).toEqual("fake message")
  })

  it("should return status 200 and empty text", async () => {
    jest.mock("ovh", () => () => ({
      requestPromised: () => {},
    }))
    await handleDeleteOvhAccount(req, res)
    expect(res._getStatusCode()).toEqual(200)
    expect(res._getData()).toEqual("")
  })
})
