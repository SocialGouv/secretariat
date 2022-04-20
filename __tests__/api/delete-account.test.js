import fetcher from "@/utils/rest-fetcher"
import handleDeleteGithubAccount from "../../src/pages/api/delete-account/github/[userLogin]"
import handleDeleteMatomoAccount from "../../src/pages/api/delete-account/matomo/[userLogin]"
import handleDeleteMattermostAccount from "../../src/pages/api/delete-account/mattermost/[userID]"
import handleDeleteNextcloudAccount from "../../src/pages/api/delete-account/nextcloud/[userID]"
import handleDeleteOvhAccount from "../../src/pages/api/delete-account/ovh/[email]"
import handleDeleteSentryAccount from "../../src/pages/api/delete-account/sentry/[userID]"
import handleDeleteZammadAccount from "../../src/pages/api/delete-account/zammad/[userID]"
import {
  deleteGithubAccount,
  deleteMatomoAccount,
  deleteMattermostAccount,
  deleteNextcloudAccount,
  deleteOvhAccount,
  deleteSentryAccount,
  deleteZammadAccount,
} from "@/services/delete-account"
import { createMocks } from "node-mocks-http"

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
  it("should return status 500 if query went wrong", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve(null))
    await handleDeleteGithubAccount(req, res)
    expect(res._getStatusCode()).toEqual(500)
  })

  it("should return status 200 if query returned status 200", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve({ status: 200 }))
    await handleDeleteGithubAccount(req, res)
    expect(res._getStatusCode()).toEqual(200)
  })
})

describe("delete Mattermost account", () => {
  it("should return status 500 if query went wrong", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve(null))
    await handleDeleteMattermostAccount(req, res)
    expect(res._getStatusCode()).toEqual(500)
  })

  it("should return status 200 if query returned 200", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve({ status: 200 }))
    await handleDeleteMattermostAccount(req, res)
    expect(res._getStatusCode()).toEqual(200)
  })
})

describe("delete Zammad account", () => {
  it("should return status 500 if query went wrong", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve(null))
    await handleDeleteZammadAccount(req, res)
    expect(res._getStatusCode()).toEqual(500)
  })

  it("should return status 200 if query returned 200", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve({ status: 200 }))
    await handleDeleteZammadAccount(req, res)
    expect(res._getStatusCode()).toEqual(200)
  })
})

describe("delete Sentry account", () => {
  it("should return status 500 if query went wrong", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve(null))
    await handleDeleteSentryAccount(req, res)
    expect(res._getStatusCode()).toEqual(500)
  })

  it("should return status 200 if query returned 200", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve({ status: 200 }))
    await handleDeleteSentryAccount(req, res)
    expect(res._getStatusCode()).toEqual(200)
  })
})

describe("delete Nextcloud account", () => {
  it("should return status 500 if query went wrong", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve(null))
    await handleDeleteNextcloudAccount(req, res)
    expect(res._getStatusCode()).toEqual(500)
  })

  it("should return status 200 if query returned 100", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve({ status: 100 }))
    await handleDeleteNextcloudAccount(req, res)
    expect(res._getStatusCode()).toEqual(200)
  })
})

describe("delete Ovh account", () => {
  it("should return status 500 if query went wrong", async () => {
    jest.mock("ovh", () => () => ({
      requestPromised: () => {
        throw Error()
      },
    }))
    await handleDeleteOvhAccount(req, res)
    expect(res._getStatusCode()).toEqual(500)
  })

  it("should return status 200 if query returned 200", async () => {
    jest.mock("ovh", () => () => ({
      requestPromised: () => {},
    }))
    await handleDeleteOvhAccount(req, res)
    expect(res._getStatusCode()).toEqual(200)
  })
})

describe("delete Matomo account", () => {
  it("should return status 500 if query went wrong", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve(null))
    await handleDeleteMatomoAccount(req, res)
    expect(res._getStatusCode()).toEqual(500)
  })

  it("should return status 200 if query returned 200", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve({ status: 200 }))
    await handleDeleteMatomoAccount(req, res)
    expect(res._getStatusCode()).toEqual(200)
  })
})
