// Polyfill "window.fetch" used in the React component.
import "whatwg-fetch"

import { server } from "./src/mocks/server"

process.env.NEXT_PUBLIC_APP_VERSION = "0.0.42"
process.env.NEXT_PUBLIC_HASURA_URL = "http://localhost:8080/v1/graphql"
process.env.NEXT_PUBLIC_APP_VERSION_COMMIT =
  "2f7c23024eeb820ed67aef00bc40e7955111cbf4"
process.env.NEXT_PUBLIC_APP_REPOSITORY_URL =
  "https://github.com/SocialGouv/secretariat"

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// https://github.com/nextauthjs/next-auth/discussions/4185
jest.mock("next-auth/react", () => {
  const originalModule = jest.requireActual("next-auth/react")

  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(),
  }
})

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
