import handleRequest from "../../../src/pages/api/onboarding/request"
import { createMocks } from "node-mocks-http"
import { graphql } from "msw"
import { setupServer } from "msw/node"
import sendEmail from "@/utils/send-email"

jest.mock("@/utils/log-action", () => jest.fn())
jest.mock("@/utils/jwt", () => ({ getJwt: jest.fn() }))
jest.mock("@/utils/send-email", () =>
  jest.fn(() => {
    return {
      status: 200,
      text: () => "fakeBody",
    }
  })
)
jest.mock("@/utils/env", () => ({
  NEXTAUTH_URL: "http://fake.fr",
  NEXT_PUBLIC_HASURA_URL: "http://fake.fr",
}))

let createOnboardingRequestCalled
const server = setupServer(
  graphql.mutation("createOnboardingRequest", (_req, res, ctx) => {
    createOnboardingRequestCalled = true
    return res(
      ctx.data({
        insert_onboarding_requests_one: {
          id: "1",
        },
      })
    )
  }),
  graphql.query("getOnboardingRequestContaining", (_req, res, ctx) => {
    return res(
      ctx.data({
        onboarding_requests: [],
      })
    )
  })
)

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" })
})

afterAll(() => {
  server.close()
})

beforeEach(() => {
  createOnboardingRequestCalled = false
  server.resetHandlers()
})

it("should create request and send email", async () => {
  const { req, res } = createMocks({
    method: "POST",
    body: { input: { data: "fakeData" } },
  })
  await handleRequest(req, res)
  expect(res._getStatusCode(200))
  expect(createOnboardingRequestCalled).toStrictEqual(true)
  expect(sendEmail).toHaveBeenCalled()
  expect(res._getJSONData()).toStrictEqual({
    status: 200,
    body: "fakeBody",
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
  expect(createOnboardingRequestCalled).toStrictEqual(false)
  expect(sendEmail).not.toHaveBeenCalled()
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
  expect(createOnboardingRequestCalled).toStrictEqual(false)
  expect(sendEmail).not.toHaveBeenCalled()
})
