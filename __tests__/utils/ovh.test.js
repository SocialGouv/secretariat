import { vi, it, expect } from "vitest"
import ovhUtil from "@/utils/ovh"

vi.mock("ovh", () => ({
  default: () => ({
    requestPromised: (method) => {
      if (method === "POST") {
        throw { error: 550, message: "fake error" }
      } else {
        return Promise.resolve(["a", "b", "c"])
      }
    },
  }),
}))

it("should return the received data", async () => {
  const result = await ovhUtil("GET", "/test")
  expect(result).toStrictEqual({
    success: true,
    data: ["a", "b", "c"],
    error: {},
  })
})

it("should return the received error", async () => {
  const result = await ovhUtil("POST", "/test")
  expect(result).toStrictEqual({
    success: false,
    data: {},
    error: { error: 550, message: "fake error" },
  })
})
