import revoke from "@/services/revoke"
import ovh from "@/utils/ovh"

jest.mock("@/utils/ovh")
jest.mock("@/utils/jwt", () => ({
  getJwt: () => "",
}))

it("should return status and body returned by service API", async () => {
  const { status } = await revoke(
    "fake account service ID",
    "fake account ID",
    "github"
  )
  expect(status).toEqual(550)
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
    ovh.mockResolvedValue({
      success: false,
      error: { error: 550, message: "fake message" },
      data: {},
    })

    const { status, body } = await revoke(
      "fake account service ID",
      "fake account ID",
      "ovh"
    )
    expect(status).toEqual(550)
    expect(body).toEqual("fake message")
  })

  it("should return status 200 and data", async () => {
    ovh.mockResolvedValue({
      success: true,
      data: "fake data",
      error: {},
    })
    jest.mock("ovh", () => () => ({
      requestPromised: () => Promise.resolve("fake data"),
    }))
    const { status, body } = await revoke(
      "fake account service ID",
      "fake account ID",
      "ovh"
    )
    expect(body).toEqual("fake data")
    expect(status).toEqual(200)
  })
})
