import onboard from "@/services/onboard"
import { createMocks } from "node-mocks-http"
import { getToken } from "next-auth/jwt"
import handleReview from "../../../src/pages/api/onboarding/review"
import { graphql } from "msw"
import { setupServer } from "msw/node"
import sendEmail from "@/utils/send-email"

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
jest.mock("@/utils/send-email", () => jest.fn())

let updateOnboardingRequestCalled
const server = setupServer(
  graphql.mutation("updateOnboardingRequest", (_req, res, ctx) => {
    updateOnboardingRequestCalled = true
    return res(
      ctx.data({
        insert_onboarding_requests_one: {
          id: "1",
        },
      })
    )
  }),
  graphql.query("getOnboardingRequest", (_req, res, ctx) => {
    return res(ctx.data({ onboarding_requests: [{ reviewed: null }] }))
  })
)

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" })
})

afterAll(() => {
  server.close()
})

beforeEach(() => {
  updateOnboardingRequestCalled = false
  server.resetHandlers()
})

it("should update request and send email", async () => {
  const { req, res } = createMocks({
    method: "POST",
    body: { input: { data: "fakeData" } },
  })
  await handleReview(req, res)
  expect(res._getStatusCode(200))
  expect(updateOnboardingRequestCalled).toStrictEqual(true)
  expect(sendEmail).toHaveBeenCalled()
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
  expect(updateOnboardingRequestCalled).toBe(false)
  expect(onboard).not.toHaveBeenCalled()
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
  expect(updateOnboardingRequestCalled).toBe(false)
  expect(onboard).not.toHaveBeenCalled()
})

it("should return 403 if no next-auth session", async () => {
  const { req, res } = createMocks({ method: "POST" })
  getToken.mockImplementation(() => Promise.resolve(false))
  await handleReview(req, res)
  expect(res._getStatusCode()).toEqual(403)
  expect(res._getJSONData()).toStrictEqual({ message: "Unauthorized" })
  expect(updateOnboardingRequestCalled).toStrictEqual(false)
  expect(onboard).not.toHaveBeenCalled()
})

it("should return 405 if wrong method", async () => {
  const { req, res } = createMocks({ method: "GET" })
  await handleReview(req, res)
  expect(res._getStatusCode()).toEqual(405)
  expect(res._getJSONData()).toStrictEqual({ message: "Method Not Allowed" })
  expect(res._getHeaders().allow).toStrictEqual("POST")
  expect(updateOnboardingRequestCalled).toStrictEqual(false)
  expect(onboard).not.toHaveBeenCalled()
})
