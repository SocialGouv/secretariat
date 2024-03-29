import { sync } from "@/services/sync"
import SERVICES from "@/utils/SERVICES"
import { createMocks } from "node-mocks-http"
import handleSync from "../../src/pages/api/sync"
import { vi, it, expect } from "vitest"

vi.mock("@/services/sync", () => ({ sync: vi.fn() }))
vi.mock("@/utils/log-action", () => ({ default: vi.fn() }))
vi.mock("@/utils/jwt", () => ({ getJwt: vi.fn() }))

it("should call the sync service with given services", async () => {
  const { req, res } = createMocks({
    method: "POST",
    body: { services: ["github", "mattermost", "wrongService"] },
  })
  await handleSync(req, res)
  expect(res._getStatusCode()).toEqual(200)
  expect(sync).toHaveBeenCalledTimes(1)
  expect(sync).toHaveBeenCalledWith(["github", "mattermost"])
})

it("should call the sync service with all services", async () => {
  const { req, res } = createMocks({
    method: "POST",
  })
  await handleSync(req, res)
  expect(res._getStatusCode()).toEqual(200)
  expect(sync).toHaveBeenCalledTimes(1)
  expect(sync).toHaveBeenCalledWith(SERVICES)
})

it("should return 405", async () => {
  const { req, res } = createMocks({
    method: "GET",
  })
  await handleSync(req, res)
  expect(res._getStatusCode()).toEqual(405)
  expect(res._getJSONData()).toStrictEqual({ message: "Method Not Allowed" })
  expect(res._getHeaders().allow).toStrictEqual("POST")
  expect(sync).toHaveBeenCalledTimes(0)
})
