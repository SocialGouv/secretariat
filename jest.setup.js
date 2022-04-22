// Polyfill "window.fetch" used in the React component.
import "whatwg-fetch"

import { server } from "./src/mocks/server"

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
