import fetcher from "@/utils/rest-fetcher"
import { fetchZammadUsers } from "@/services/fetchers/zammad"

jest.mock("@/utils/rest-fetcher")

it("should return a list of fetched users", async () => {
  fetcher
    .mockResolvedValueOnce(
      Promise.resolve({ json: () => Promise.resolve([{}, {}, {}]) })
    )
    .mockResolvedValue(Promise.resolve({ json: () => Promise.resolve([]) }))

  const result = await fetchZammadUsers()
  expect(result).toStrictEqual([{ groups: [] }, { groups: [] }, { groups: [] }])
})

it("should return an empty list if no response", async () => {
  fetcher.mockResolvedValue(Promise.resolve(null))

  const result = await fetchZammadUsers()
  expect(result).toStrictEqual([])
})
