import revoke from "@/services/revoke"
import { createMocks } from "node-mocks-http"
import { getSession } from "next-auth/react"
import handleRevoke from "../../src/pages/api/revoke"

jest.mock("next-auth/react", () => ({
  getSession: jest.fn(),
}))
jest.mock("@/services/revoke", () =>
  jest.fn(() => ({ status: 250, body: "fake body" }))
)
jest.mock("@/utils/log-action", () => jest.fn())
jest.mock("@/utils/jwt", () => ({ getJwt: jest.fn() }))

let req, res
beforeEach(() => {
  revoke.mockClear()
  ;({ req, res } = createMocks({
    method: "POST",
    body: {
      accountServiceID: "fake accountServiceID",
      accountID: "fake accountID",
      serviceName: "github",
    },
  }))
})

it("should call the revoke service and return its return value", async () => {
  getSession.mockImplementation(() =>
    Promise.resolve({ user: { login: "fake login" } })
  )
  await handleRevoke(req, res)
  expect(res._getStatusCode()).toEqual(250)
  expect(res._getData()).toEqual("fake body")
  expect(revoke).toHaveBeenCalledWith(
    "fake accountServiceID",
    "fake accountID",
    "github"
  )
})

it("should return 400 if service name is incorrect", async () => {
  getSession.mockImplementation(() =>
    Promise.resolve({ user: { login: "fake login" } })
  )
  req.body.serviceName = "fake serviceName"
  await handleRevoke(req, res)
  expect(res._getStatusCode()).toEqual(400)
  expect(res._getData()).toEqual("unknown service name")
  expect(revoke).not.toHaveBeenCalled()
})

it("should return 403 if no next-auth session", async () => {
  getSession.mockImplementation(() => Promise.resolve(false))
  await handleRevoke(req, res)
  expect(res._getStatusCode()).toEqual(403)
  expect(revoke).not.toHaveBeenCalled()
})
