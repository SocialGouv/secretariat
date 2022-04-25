import fetcher from "@/utils/rest-fetcher"
import { createMocks } from "node-mocks-http"
import handleDeleteGithubAccount from "../../src/pages/api/delete-account/github/[userLogin]"
import handleDeleteMatomoAccount from "../../src/pages/api/delete-account/matomo/[userLogin]"
import handleDeleteMattermostAccount from "../../src/pages/api/delete-account/mattermost/[userID]"
import handleDeleteNextcloudAccount from "../../src/pages/api/delete-account/nextcloud/[userID]"
import handleDeleteOvhAccount from "../../src/pages/api/delete-account/ovh/[email]"
import handleDeleteSentryAccount from "../../src/pages/api/delete-account/sentry/[userID]"
import handleDeleteZammadAccount from "../../src/pages/api/delete-account/zammad/[userID]"

jest.mock("@/utils/rest-fetcher")

let req, res
beforeEach(() => {
  jest.resetModules()
  ;({ req, res } = createMocks({
    method: "GET",
    query: {
      userLogin: "fake user",
      userID: "fake user",
    },
  }))
})

describe("/api/delete-account/github/[userLogin]", () => {
  it("should return status 500 and empty text if query went wrong", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve(null))
    await handleDeleteGithubAccount(req, res)
    expect(res._getStatusCode()).toEqual(500)
    expect(res._getData()).toEqual("")
  })

  it("should return status and text from response", async () => {
    fetcher.mockImplementationOnce(() =>
      Promise.resolve({ status: 200, text: () => Promise.resolve("test text") })
    )
    await handleDeleteGithubAccount(req, res)
    expect(res._getStatusCode()).toEqual(200)
    expect(res._getData()).toEqual("test text")
  })
})

describe("delete Mattermost account", () => {
  it("should return status 500 and empty text if query went wrong", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve(null))
    await handleDeleteMattermostAccount(req, res)
    expect(res._getStatusCode()).toEqual(500)
    expect(res._getData()).toEqual("")
  })

  it("should return status and text from response", async () => {
    fetcher.mockImplementationOnce(() =>
      Promise.resolve({ status: 200, text: () => Promise.resolve("test text") })
    )
    await handleDeleteMattermostAccount(req, res)
    expect(res._getStatusCode()).toEqual(200)
    expect(res._getData()).toEqual("test text")
  })
})

describe("delete Zammad account", () => {
  it("should return status 500 and empty text if query went wrong", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve(null))
    await handleDeleteZammadAccount(req, res)
    expect(res._getStatusCode()).toEqual(500)
    expect(res._getData()).toEqual("")
  })

  it("should return status and text from response", async () => {
    fetcher.mockImplementationOnce(() =>
      Promise.resolve({ status: 200, text: () => Promise.resolve("test text") })
    )
    await handleDeleteZammadAccount(req, res)
    expect(res._getStatusCode()).toEqual(200)
    expect(res._getData()).toEqual("test text")
  })
})

describe("delete Sentry account", () => {
  it("should return status 500 and empty text if query went wrong", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve(null))
    await handleDeleteSentryAccount(req, res)
    expect(res._getStatusCode()).toEqual(500)
    expect(res._getData()).toEqual("")
  })

  it("should return status and text from response", async () => {
    fetcher.mockImplementationOnce(() =>
      Promise.resolve({ status: 200, text: () => Promise.resolve("test text") })
    )
    await handleDeleteSentryAccount(req, res)
    expect(res._getStatusCode()).toEqual(200)
    expect(res._getData()).toEqual("test text")
  })
})

describe("delete Nextcloud account", () => {
  it("should return status 500 and empty text if query went wrong", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve(null))
    await handleDeleteNextcloudAccount(req, res)
    expect(res._getStatusCode()).toEqual(500)
    expect(res._getData()).toEqual("")
  })

  it("should return status and text from response", async () => {
    fetcher.mockImplementationOnce(() =>
      Promise.resolve({ status: 200, text: () => Promise.resolve("test text") })
    )
    await handleDeleteNextcloudAccount(req, res)
    expect(res._getStatusCode()).toEqual(200)
    expect(res._getData()).toEqual("test text")
  })
})

describe("delete Ovh account", () => {
  it("should return status 500 error message on exception", async () => {
    jest.mock("ovh", () => () => ({
      requestPromised: () => {
        throw Error("test error")
      },
    }))
    await handleDeleteOvhAccount(req, res)
    expect(res._getStatusCode()).toEqual(500)
    expect(res._getData()).toEqual(Error("test error"))
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

describe("delete Matomo account", () => {
  it("should return status 500 and empty text if query went wrong", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve(null))
    await handleDeleteMatomoAccount(req, res)
    expect(res._getStatusCode()).toEqual(500)
    expect(res._getData()).toEqual("")
  })

  it("should return status and text from response", async () => {
    fetcher.mockImplementationOnce(() =>
      Promise.resolve({ status: 200, text: () => Promise.resolve("test text") })
    )
    await handleDeleteMatomoAccount(req, res)
    expect(res._getStatusCode()).toEqual(200)
    expect(res._getData()).toEqual("test text")
  })
})
