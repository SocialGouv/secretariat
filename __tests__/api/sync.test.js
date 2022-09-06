import sync from "@/services/sync"
import { createMocks } from "node-mocks-http"
import handleSync from "../../src/pages/api/sync"

jest.mock("@/services/sync", () => jest.fn())

let req, res
beforeEach(() => {
  ;({ req, res } = createMocks({
    method: "GET",
  }))
})

it("should call the sync service and return 200", async () => {
  await handleSync(req, res)
  expect(res._getStatusCode()).toEqual(200)
  expect(sync).toHaveBeenCalledTimes(1)
})
