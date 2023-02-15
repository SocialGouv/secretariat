import fetcher from "@/utils/rest-fetcher"
import { fetchZammadUsers } from "@/services/fetchers/zammad"

jest.mock("@/utils/rest-fetcher")

it("should return a list of fetched users", async () => {
  fetcher
    .mockResolvedValueOnce(
      Promise.resolve({
        json: () => Promise.resolve([{ id: 0 }, { id: 1 }, { id: 2 }]),
      })
    )
    .mockResolvedValue(Promise.resolve({ json: () => Promise.resolve([]) }))

  const result = await fetchZammadUsers()
  expect(result).toStrictEqual([
    { id: "0", groups: [] },
    { id: "1", groups: [] },
    { id: "2", groups: [] },
  ])
})

it("should return an empty list if no response", async () => {
  fetcher.mockResolvedValue(Promise.resolve(null))

  const result = await fetchZammadUsers()
  expect(result).toStrictEqual([])
})
