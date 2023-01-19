import handleRequest from "../../../src/pages/api/onboarding/request"
import { createMocks } from "node-mocks-http"
import { graphql } from "msw"
import { sendRequestMail } from "@/services/send-email"
import { server } from "@/mocks/server"

jest.mock("@/utils/log-action", () => jest.fn())
jest.mock("@/utils/jwt", () => ({ getJwt: jest.fn() }))
jest.mock("@/services/send-email", () => ({
  sendRequestMail: jest.fn(() => ({
    status: 200,
    text: () => Promise.resolve("response"),
  })),
}))
jest.mock("@/utils/env", () => ({
  NEXTAUTH_URL: "http://fake.fr",
  NEXT_PUBLIC_HASURA_URL: "http://fake.fr",
}))

it("should create request and send email", async () => {
  const { req, res } = createMocks({
    method: "POST",
    body: { input: { data: "fakeData" } },
  })
  await handleRequest(req, res)
  expect(res._getStatusCode(200))
  expect(sendRequestMail).toHaveBeenCalled()
  expect(res._getJSONData()).toStrictEqual({
    status: 200,
    body: "request created",
  })
})

it("should not create duplicate request", async () => {
  const { req, res } = createMocks({
    method: "POST",
    body: { input: { data: "fakeData" } },
  })
  server.use(
    graphql.query("getOnboardingRequestContaining", (_req, res, ctx) => {
      return res(
        ctx.data({
          onboarding_requests: ["fakeExistingRequest"],
        })
      )
    })
  )
  await handleRequest(req, res)
  expect(res._getStatusCode(200))
  expect(sendRequestMail).not.toHaveBeenCalled()
  expect(res._getJSONData()).toStrictEqual({
    status: 400,
    body: "already exists",
  })
})

it("should return 405", async () => {
  const { req, res } = createMocks({
    method: "GET",
  })
  await handleRequest(req, res)
  expect(res._getStatusCode()).toEqual(405)
  expect(res._getJSONData()).toStrictEqual({ message: "Method Not Allowed" })
  expect(res._getHeaders().allow).toStrictEqual("POST")
  expect(sendRequestMail).not.toHaveBeenCalled()
})
