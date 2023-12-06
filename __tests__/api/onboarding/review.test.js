import onboard from "@/services/onboard"
import { createMocks } from "node-mocks-http"
import { getToken } from "next-auth/jwt"
import handleReview from "@/pages/api/onboarding/review"
import { graphql, HttpResponse } from "msw"
import { sendReviewMail } from "@/services/send-email"
import { server } from "@/mocks/server"
import { vi, it, expect } from "vitest"

vi.mock("next-auth/jwt", () => ({
  getToken: vi.fn(() => ({ user: { login: "testUser" } })),
}))
vi.mock("@/services/onboard", () => ({
  default: vi.fn(() => ({ github: { status: 250, body: "fake body" } })),
}))
vi.mock("@/utils/log-action", () => ({ default: vi.fn() }))
vi.mock("@/utils/jwt", async () => {
  const actual = await vi.importActual("@/utils/jwt")
  return {
    ...actual,
    getJwt: vi.fn(),
  }
})
vi.mock("@/services/send-email", () => ({
  sendReviewMail: vi.fn(),
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
    graphql.query("getOnboardingRequest", () =>
      HttpResponse.json({ data: { onboarding_requests: [{ reviewed: {} }] } })
    )
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
    graphql.query("getOnboardingRequest", () =>
      HttpResponse.json({ data: { onboarding_requests: [] } })
    )
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
