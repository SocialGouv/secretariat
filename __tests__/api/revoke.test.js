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

let req, res
beforeEach(() => {
  revoke.mockClear()
  ;({ req, res } = createMocks({
    method: "POST",
    body: {
      accountServiceID: "fake accountServiceID",
      accountID: "fake accountID",
      serviceName: "fake serviceName",
    },
  }))
})

it("should call the revoke service and return its return value", async () => {
  getSession.mockImplementation(() => Promise.resolve(true))
  await handleRevoke(req, res)
  expect(res._getStatusCode()).toEqual(250)
  expect(res._getData()).toEqual("fake body")
  expect(revoke).toHaveBeenCalledWith(
    "fake accountServiceID",
    "fake accountID",
    "fake serviceName"
  )
})

it("should return 403 if no next-auth session", async () => {
  getSession.mockImplementation(() => Promise.resolve(false))
  await handleRevoke(req, res)
  expect(res._getStatusCode()).toEqual(403)
  expect(revoke).not.toHaveBeenCalled()
})
