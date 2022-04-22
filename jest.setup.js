// Polyfill "window.fetch" used in the React component.
import "whatwg-fetch"

import { server } from "./src/mocks/server"

process.env.NEXT_PUBLIC_HASURA_URL = "http://localhost:8080/v1/graphql"

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
