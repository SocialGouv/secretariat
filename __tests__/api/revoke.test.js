import revoke from "@/services/revoke"
import { createMocks } from "node-mocks-http"
import { getToken } from "next-auth/jwt"
import handleRevoke from "../../src/pages/api/revoke"

jest.mock("next-auth/jwt", () => ({
  getToken: jest.fn(() => ({ user: { login: "testUser" } })),
}))
jest.mock("@/services/revoke", () =>
  jest.fn(() => ({ status: 250, body: "fake body" }))
)
jest.mock("@/utils/log-action", () => jest.fn())
jest.mock("@/utils/jwt", () => ({
  getJwt: jest.fn(),
}))

let req, res
beforeEach(() => {
  ;({ req, res } = createMocks({
    method: "DELETE",
    body: {
      input: {
        data: {
          accountServiceID: "fake accountServiceID",
          accountID: "fake accountID",
          serviceName: "github",
        },
      },
    },
  }))
})

it.skip("should call the revoke service and return its return value", async () => {
  await handleRevoke(req, res)
  expect(res._getStatusCode()).toEqual(200)
  expect(res._getData()).toEqual('{"status":250,"body":"fake body"}')
  expect(revoke).toHaveBeenCalledWith(
    "fake accountServiceID",
    "fake accountID",
    "github"
  )
})

it.skip("should return 400 if service name is incorrect", async () => {
  req.body.input.data.serviceName = "fake serviceName"
  await handleRevoke(req, res)
  expect(res._getStatusCode()).toEqual(400)
  expect(res._getJSONData()).toEqual({ message: "unknown service name" })
  expect(revoke).not.toHaveBeenCalled()
})

it.skip("should return 403 if no next-auth session", async () => {
  getToken.mockImplementation(() => Promise.resolve(false))
  await handleRevoke(req, res)
  expect(res._getStatusCode()).toEqual(403)
  expect(res._getJSONData()).toStrictEqual({ message: "Unauthorized" })
  expect(revoke).not.toHaveBeenCalled()
})

it.skip("should return 405 if wrong method", async () => {
  ;({ req, res } = createMocks({ method: "GET" }))
  await handleRevoke(req, res)
  expect(res._getStatusCode()).toEqual(405)
  expect(res._getJSONData()).toStrictEqual({ message: "Method Not Allowed" })
  expect(res._getHeaders().allow).toStrictEqual("DELETE")
  expect(revoke).toHaveBeenCalledTimes(0)
})
