import fetcher from "@/utils/rest-fetcher"
import { fetchMattermostUsers } from "@/services/fetchers/mattermost"
import { vi, it, expect } from "vitest"

vi.mock("@/utils/rest-fetcher")

it("should return a list of fetched users", async () => {
  fetcher
    .mockResolvedValueOnce({
      json: () => Promise.resolve([{ id: "0" }, { id: "1" }, { id: "2" }]),
    })
    .mockResolvedValueOnce({ json: () => Promise.resolve([]) })
    .mockResolvedValueOnce({
      json: () => Promise.resolve([{ id: "a" }, { id: "b" }]),
    })
    .mockResolvedValueOnce({ json: () => Promise.resolve([]) })
    .mockResolvedValueOnce({
      json: () => Promise.resolve([{ user_id: "1" }, { user_id: "2" }]),
    })
    .mockResolvedValueOnce({ json: () => Promise.resolve([]) })

  const result = await fetchMattermostUsers()
  expect(result).toStrictEqual([
    { id: "0", teams: [] },
    { id: "1", teams: [{ id: "a" }] },
    { id: "2", teams: [{ id: "a" }] },
  ])
})

it("should return an empty list if no response", async () => {
  fetcher.mockResolvedValue(null)

  const result = await fetchMattermostUsers()
  expect(result).toStrictEqual([])
})
