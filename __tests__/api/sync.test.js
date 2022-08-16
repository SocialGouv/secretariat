import sync from "@/services/sync"
import { createMocks } from "node-mocks-http"
import handleSync from "../../src/pages/api/sync"

jest.mock("@/services/sync", () => jest.fn())
jest.mock("@/utils/log-action", () => jest.fn())
jest.mock("@/utils/jwt", () => ({ getJwt: jest.fn() }))

let req, res
beforeEach(() => {
  ;({ req, res } = createMocks({
    method: "GET",
  }))
})

it("should call the sync service and return 202", async () => {
  await handleSync(req, res)
  expect(res._getStatusCode()).toEqual(202)
  expect(sync).toHaveBeenCalledTimes(1)
})
