import fetcher from "@/utils/rest-fetcher"
import { fetchNextcloudUsers } from "@/services/fetchers/nextcloud"

jest.mock("@/utils/rest-fetcher")

it("should return a list of fetched users", async () => {
  fetcher
    .mockResolvedValueOnce(
      Promise.resolve({
        json: () => Promise.resolve({ ocs: { data: { users: ["", "", ""] } } }),
      })
    )
    .mockResolvedValueOnce(
      Promise.resolve({
        json: () => Promise.resolve({ ocs: { data: { users: [] } } }),
      })
    )
    .mockResolvedValue(
      Promise.resolve({
        json: () =>
          Promise.resolve({ ocs: { data: { login: "login", enabled: true } } }),
      })
    )

  const result = await fetchNextcloudUsers()
  expect(result).toStrictEqual([
    { login: "login", enabled: true },
    { login: "login", enabled: true },
    { login: "login", enabled: true },
  ])
})

it("should return an empty list if no response", async () => {
  fetcher.mockResolvedValue(Promise.resolve(null))

  const result = await fetchNextcloudUsers()
  expect(result).toStrictEqual([])
})
