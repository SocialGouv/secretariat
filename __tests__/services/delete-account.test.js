import fetcher from "@/utils/rest-fetcher"
import {
  deleteGithubAccount,
  deleteMatomoAccount,
  deleteMattermostAccount,
  deleteNextcloudAccount,
  deleteOvhAccount,
  deleteSentryAccount,
  deleteZammadAccount,
} from "@/services/delete-account"

jest.mock("@/utils/rest-fetcher")

beforeEach(() => {
  jest.resetModules()
})

describe("delete Github account", () => {
  it("should return status 500 if query went wrong", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve(null))
    const status = await deleteGithubAccount("fake user")
    expect(status).toEqual(500)
  })

  it("should return status 200 if query returned status 200", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve({ status: 200 }))
    const status = await deleteGithubAccount("fake user")
    expect(status).toEqual(200)
  })
})

describe("delete Mattermost account", () => {
  it("should return status 500 if query went wrong", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve(null))
    const status = await deleteMattermostAccount("fake user")
    expect(status).toEqual(500)
  })

  it("should return status 200 if query returned 200", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve({ status: 200 }))
    const status = await deleteMattermostAccount("fake user")
    expect(status).toEqual(200)
  })
})

describe("delete Zammad account", () => {
  it("should return status 500 if query went wrong", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve(null))
    const status = await deleteZammadAccount("fake user")
    expect(status).toEqual(500)
  })

  it("should return status 200 if query returned 200", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve({ status: 200 }))
    const status = await deleteZammadAccount("fake user")
    expect(status).toEqual(200)
  })
})

describe("delete Sentry account", () => {
  it("should return status 500 if query went wrong", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve(null))
    const status = await deleteSentryAccount("fake user")
    expect(status).toEqual(500)
  })

  it("should return status 200 if query returned 200", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve({ status: 200 }))
    const status = await deleteSentryAccount("fake user")
    expect(status).toEqual(200)
  })
})

describe("delete Nextcloud account", () => {
  it("should return status 500 if query went wrong", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve(null))
    const status = await deleteNextcloudAccount("fake user")
    expect(status).toEqual(500)
  })

  it("should return status 200 if query returned 200", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve({ status: 200 }))
    const status = await deleteNextcloudAccount("fake user")
    expect(status).toEqual(200)
  })
})

describe("delete Ovh account", () => {
  it("should return status 500 if query went wrong", async () => {
    jest.mock("ovh", () => () => ({
      requestPromised: () => {
        throw Error()
      },
    }))
    const status = await deleteOvhAccount("fake user")
    expect(status).toEqual(500)
  })

  it("should return status 200 if query returned 200", async () => {
    jest.mock("ovh", () => () => ({
      requestPromised: () => {},
    }))
    const status = await deleteOvhAccount("fake user")
    expect(status).toEqual(200)
  })
})

describe("delete Matomo account", () => {
  it("should return status 500 if query went wrong", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve(null))
    const status = await deleteMatomoAccount("fake user")
    expect(status).toEqual(500)
  })

  it("should return status 200 if query returned 200", async () => {
    fetcher.mockImplementationOnce(() => Promise.resolve({ status: 200 }))
    const status = await deleteMatomoAccount("fake user")
    expect(status).toEqual(200)
  })
})
