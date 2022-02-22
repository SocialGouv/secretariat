import fetcher from "@/utils/rest-fetcher"
import { fetchMattermostUsers } from "@/services/fetchers/mattermost"

jest.mock("@/utils/rest-fetcher")

it("should return a list of fetched users", async () => {
  fetcher
    .mockResolvedValueOnce(
      Promise.resolve({ json: () => Promise.resolve([{}, {}, {}]) })
    )
    .mockResolvedValue(Promise.resolve({ json: () => Promise.resolve([]) }))

  const result = await fetchMattermostUsers()
  expect(result).toMatchObject([{}, {}, {}])
})
