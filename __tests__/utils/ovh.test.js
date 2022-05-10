import ovh from "@/utils/ovh"

beforeEach(() => {
  jest.resetModules()
})

it("should return the received data", async () => {
  jest.mock("ovh", () => () => ({
    requestPromised: jest
      .fn()
      .mockResolvedValue(Promise.resolve(["a", "b", "c"])),
  }))

  const result = await ovh("GET", "/test")
  expect(result).toStrictEqual({
    success: true,
    data: ["a", "b", "c"],
    error: {},
  })
})

it("should return the received error", async () => {
  jest.mock("ovh", () => () => ({
    requestPromised: jest.fn().mockImplementation(() => {
      throw { error: 550, message: "fake error" }
    }),
  }))

  const result = await ovh("GET", "/test")
  expect(result).toStrictEqual({
    success: false,
    data: {},
    error: { error: 550, message: "fake error" },
  })
})
