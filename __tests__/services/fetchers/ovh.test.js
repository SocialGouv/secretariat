import { fetchOvhUsers } from "@/services/fetchers/ovh"

beforeEach(() => {
  jest.resetModules()
})

it("should return a list of fetched users", async () => {
  jest.mock("ovh", () => () => ({
    requestPromised: jest
      .fn()
      .mockResolvedValueOnce(Promise.resolve(["", "", ""]))
      .mockResolvedValue(Promise.resolve({})),
  }))

  const result = await fetchOvhUsers()
  expect(result).toStrictEqual([{}, {}, {}])
})

it("should return an empty list on catch", async () => {
  jest.mock("ovh", () => () => ({
    requestPromised: () => {
      throw Error
    },
  }))

  const result = await fetchOvhUsers()
  expect(result).toMatchObject([])
})
