// Polyfill "window.fetch" used in the React component.
// import "whatwg-fetch"

import { server } from "./src/mocks/server"
import { beforeAll, afterAll, afterEach, vi } from "vitest"
import { cleanup } from "@testing-library/react"

process.env.NEXT_PUBLIC_APP_VERSION = "0.0.42"
process.env.NEXT_PUBLIC_HASURA_URL = "http://localhost:8080/v1/graphql"
process.env.NEXT_PUBLIC_APP_REPOSITORY_URL =
  "https://github.com/SocialGouv/secretariat"

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" })
})

afterEach(() => {
  server.resetHandlers()
  cleanup()
})

afterAll(() => {
  server.close()
})
