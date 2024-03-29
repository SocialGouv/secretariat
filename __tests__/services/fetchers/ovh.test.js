import ovh from "@/utils/ovh"
import { fetchOvhUsers } from "@/services/fetchers/ovh"
import { vi, beforeEach, it, expect } from "vitest"

vi.mock("@/utils/ovh")

beforeEach(() => {
  vi.resetModules()
})

it("should return a list of fetched users", async () => {
  ovh
    .mockResolvedValueOnce({ success: true, data: ["", "", ""] })
    .mockResolvedValue({ success: true, data: {} })

  const result = await fetchOvhUsers()
  expect(result).toStrictEqual([{}, {}, {}])
})

it("should return an empty list on error", async () => {
  ovh.mockResolvedValue({
    success: false,
    error: { error: 500, message: "error" },
  })

  const result = await fetchOvhUsers()
  expect(result).toStrictEqual([])
})
