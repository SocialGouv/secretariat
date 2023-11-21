import fetcher from "@/utils/rest-fetcher"
import { fetchSentryUsers } from "@/services/fetchers/sentry"
import { vi, it, expect } from "vitest"

vi.mock("@/utils/rest-fetcher")

it("should return a list of fetched users", async () => {
  fetcher.mockResolvedValue(
    Promise.resolve({ json: () => Promise.resolve([{}, {}, {}]) })
  )

  const result = await fetchSentryUsers()
  expect(result).toStrictEqual([{}, {}, {}])
})

it("should return an empty list if no response", async () => {
  fetcher.mockResolvedValue(Promise.resolve(null))

  const result = await fetchSentryUsers()
  expect(result).toStrictEqual([])
})
