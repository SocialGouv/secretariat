import onboard from "@/services/onboard"
import ovh from "@/utils/ovh"
import sluggifyString from "@/utils/sluggify-string"
import { vi, it, expect, describe } from "vitest"

vi.mock("@/utils/jwt", () => ({
  getJwt: () => "",
}))
vi.mock("@/utils/ovh")

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
    .mockResolvedValueOnce({ success: true, data: ["fake@configureme.me"] })
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

it("should stop if no available mailbox could be found", async () => {
  ovh
    .mockResolvedValueOnce({ success: true, data: ["fake@fabrique.fr"] })
    .mockResolvedValue({ success: true, data: "fake data" })

  const response = await onboard({
    services: { mattermost: false, ovh: true },
    firstName: "fake firstname",
    lastName: "fake lastname",
    githubLogin: "",
  })
  expect(response).toMatchObject({
    ovh: {
      status: 503,
      body: "Could not get an available configureme.me OVH email",
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
  it("should handle error on query 2", async () => {
    ovh
      .mockResolvedValueOnce({ success: true, data: ["fake@configureme.me"] })
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
      ovh: {
        status: 550,
        body: "fake message",
        mailInfo: { login: "fake-firstname.fake-lastname" },
      },
    })
  })
  it("should handle error on query 3", async () => {
    ovh
      .mockResolvedValueOnce({ success: true, data: ["fake@configureme.me"] })
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
      ovh: {
        status: 550,
        body: "fake message",
        mailInfo: { login: "fake-firstname.fake-lastname" },
      },
    })
  })
})
