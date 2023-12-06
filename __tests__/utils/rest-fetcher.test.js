import fetcher from "@/utils/rest-fetcher"
import { it, expect } from "vitest"

it("should return non null if response is ok", () => {
  const unmockedFetch = global.fetch
  global.fetch = () =>
    Promise.resolve({
      ok: true,
    })

  expect(fetcher("")).resolves.not.toBeNull()

  global.fetch = unmockedFetch
})

it("should return null if response is not ok", () => {
  const unmockedFetch = global.fetch
  global.fetch = () =>
    Promise.resolve({
      ok: false,
    })

  expect(fetcher("")).resolves.toBeNull()

  global.fetch = unmockedFetch
})
