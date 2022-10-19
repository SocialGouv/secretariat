import onboard from "@/services/onboard"
import { createMocks } from "node-mocks-http"
import { getToken } from "next-auth/jwt"
import handleReview from "../../../src/pages/api/onboarding/review"
import { graphql } from "msw"
import { sendReviewMail } from "@/utils/send-email"
import { server } from "../../../src/mocks/server"

jest.mock("next-auth/jwt", () => ({
  getToken: jest.fn(() => ({ user: { login: "testUser" } })),
}))
jest.mock("@/services/onboard", () =>
  jest.fn(() => ({ github: { status: 250, body: "fake body" } }))
)
jest.mock("@/utils/log-action", () => jest.fn())
jest.mock("@/utils/jwt", () => ({
  getJwt: jest.fn(),
}))
jest.mock("@/utils/send-email", () => ({
  sendReviewMail: jest.fn(),
}))

it("should onboard user and send email", async () => {
  const { req, res } = createMocks({
    method: "POST",
    body: { input: { data: "fakeData" } },
  })
  await handleReview(req, res)
  expect(res._getStatusCode(200))
  expect(onboard).toHaveBeenCalledTimes(1)
  expect(sendReviewMail).toHaveBeenCalledTimes(1)
  expect(res._getJSONData()).toStrictEqual({
    github: { body: "fake body", status: 250 },
  })
})

it("should return 400 if request is already reviewed", async () => {
  const { req, res } = createMocks({
    method: "POST",
    body: { input: { data: "fakeData" } },
  })
  server.use(
    graphql.query("getOnboardingRequest", (_req, res, ctx) => {
      return res(ctx.data({ onboarding_requests: [{ reviewed: {} }] }))
    })
  )
  await handleReview(req, res)
  expect(res._getStatusCode()).toBe(400)
  expect(res._getJSONData()).toStrictEqual({
    message: "Onboarding request already reviewed",
  })
  expect(onboard).not.toHaveBeenCalled()
  expect(sendReviewMail).not.toHaveBeenCalled()
})

it("should return 500 if request does not exist", async () => {
  const { req, res } = createMocks({
    method: "POST",
    body: { input: { data: "fakeData" } },
  })
  server.use(
    graphql.query("getOnboardingRequest", (_req, res, ctx) => {
      return res(ctx.data({ onboarding_requests: [] }))
    })
  )
  await handleReview(req, res)
  expect(res._getStatusCode()).toBe(500)
  expect(res._getJSONData()).toStrictEqual({
    message: "Could not find an onboarding request for this ID",
  })
  expect(onboard).not.toHaveBeenCalled()
  expect(sendReviewMail).not.toHaveBeenCalled()
})

it("should return 403 if no next-auth session", async () => {
  const { req, res } = createMocks({ method: "POST" })
  getToken.mockImplementation(() => Promise.resolve(false))
  await handleReview(req, res)
  expect(res._getStatusCode()).toEqual(403)
  expect(res._getJSONData()).toStrictEqual({ message: "Unauthorized" })
  expect(sendReviewMail).not.toHaveBeenCalled()
  expect(onboard).not.toHaveBeenCalled()
})

it("should return 405 if wrong method", async () => {
  const { req, res } = createMocks({ method: "GET" })
  await handleReview(req, res)
  expect(res._getStatusCode()).toEqual(405)
  expect(res._getJSONData()).toStrictEqual({ message: "Method Not Allowed" })
  expect(res._getHeaders().allow).toStrictEqual("POST")
  expect(sendReviewMail).not.toHaveBeenCalled()
  expect(onboard).not.toHaveBeenCalled()
})
