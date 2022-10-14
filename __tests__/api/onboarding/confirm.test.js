import { createMocks } from "node-mocks-http"
import handleConfirm from "../../../src/pages/api/onboarding/confirm"
import { graphql } from "msw"
import { setupServer } from "msw/node"
import { sendConfirmMail } from "@/utils/send-email"

jest.mock("@/utils/log-action", () => jest.fn())
jest.mock("@/utils/jwt", () => ({ getJwt: jest.fn() }))
jest.mock("@/utils/send-email", () => ({ sendConfirmMail: jest.fn() }))
jest.mock("@/utils/env", () => ({
  ONBOARDING_NOTIFICATION_EMAILS: "mail",
  NEXTAUTH_URL: "http://fake.fr",
  NEXT_PUBLIC_HASURA_URL: "http://fake.fr",
}))

const server = setupServer(
  graphql.mutation("confirmOnboardingRequest", (_req, res, ctx) => {
    return res(
      ctx.data({
        update_onboarding_requests: {
          affected_rows: 1,
          returning: [
            {
              data: { firstName: "fake firstname", lastName: "fake lastname" },
            },
          ],
        },
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
  server.resetHandlers()
})

it("should confirm request and send email", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { id: "fakeId" },
  })
  await handleConfirm(req, res)
  expect(res._getStatusCode(200))
  expect(sendConfirmMail).toHaveBeenCalled()
})

it("should not confirm multiple times", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { id: "fakeId" },
  })
  server.use(
    graphql.mutation("confirmOnboardingRequest", (_req, res, ctx) => {
      return res(
        ctx.data({
          update_onboarding_requests: {
            affected_rows: 0,
          },
        })
      )
    })
  )
  await handleConfirm(req, res)
  expect(res._getStatusCode(200))
  expect(sendConfirmMail).not.toHaveBeenCalled()
})

it("should return 405", async () => {
  const { req, res } = createMocks({
    method: "POST",
  })
  await handleConfirm(req, res)
  expect(res._getStatusCode()).toEqual(405)
  expect(res._getJSONData()).toStrictEqual({ message: "Method Not Allowed" })
  expect(res._getHeaders().allow).toStrictEqual("GET")
  expect(sendConfirmMail).not.toHaveBeenCalled()
})
