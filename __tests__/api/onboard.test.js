import onboard from "@/services/onboard"
import { createMocks } from "node-mocks-http"
import { getSession } from "next-auth/react"
import handleOnboard from "../../src/pages/api/onboard"

jest.mock("next-auth/react", () => ({
  getSession: jest.fn(),
}))
jest.mock("@/services/onboard", () => jest.fn(() => ({ data: "fake data" })))

let req, res
beforeEach(() => {
  onboard.mockClear()
  ;({ req, res } = createMocks({
    method: "POST",
    body: {
      lastname: "fake lastname",
      services: {
        ovh: { login: "fake login" },
        mattermost: {},
        github: { login: "fake login" },
      },
    },
  }))
})

it("should call the onboard service and return its return value", async () => {
  getSession.mockResolvedValue(true)
  await handleOnboard(req, res)
  expect(res._getStatusCode()).toEqual(200)
  expect(res._getData()).toStrictEqual(JSON.stringify({ data: "fake data" }))
  expect(onboard).toHaveBeenCalledWith({
    lastname: "fake lastname",
    services: {
      ovh: { login: "fake login" },
      mattermost: {},
      github: { login: "fake login" },
    },
  })
})

it("should return 403 if no next-auth session", async () => {
  getSession.mockResolvedValue(false)
  await handleOnboard(req, res)
  expect(res._getStatusCode()).toEqual(403)
  expect(onboard).not.toHaveBeenCalled()
})
