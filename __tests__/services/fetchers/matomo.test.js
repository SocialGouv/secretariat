import fetcher from "@/utils/rest-fetcher"
import { fetchMatomoUsers } from "@/services/fetchers/matomo"

jest.mock("@/utils/rest-fetcher")

it("should return a list of fetched users", async () => {
  fetcher
    .mockResolvedValueOnce(
      Promise.resolve({ json: () => Promise.resolve([{}]) })
    )
    .mockResolvedValue(Promise.resolve({ json: () => Promise.resolve([]) }))

  const result = await fetchMatomoUsers()
  expect(result).toHaveLength(1)
  expect(result[0]).toHaveProperty("id")
})
