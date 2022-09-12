import sync from "@/services/sync"
import SERVICES from "@/utils/SERVICES"
import { fetchGithubUsers } from "@/services/fetchers/github"
import { fetchMatomoUsers } from "@/services/fetchers/matomo"
import { fetchMattermostUsers } from "@/services/fetchers/mattermost"
import { fetchNextcloudUsers } from "@/services/fetchers/nextcloud"
import { fetchOvhUsers } from "@/services/fetchers/ovh"
import { fetchSentryUsers } from "@/services/fetchers/sentry"
import { fetchZammadUsers } from "@/services/fetchers/zammad"
import { graphql } from "msw"
import { setupServer } from "msw/node"

const servicesFetchers = {
  github: fetchGithubUsers,
  matomo: fetchMatomoUsers,
  mattermost: fetchMattermostUsers,
  nextcloud: fetchNextcloudUsers,
  ovh: fetchOvhUsers,
  sentry: fetchSentryUsers,
  zammad: fetchZammadUsers,
}

jest.mock("@/utils/jwt", () => ({
  getJwt: () => "",
}))

let insertAccountCalled
let insertUserCalled
let updateServiceCalled
const server = setupServer(
  graphql.mutation("insertService", (_req, res, ctx) => {
    insertAccountCalled = true
    return res(
      ctx.data({
        insert_services_one: {
          id: "1",
        },
      })
    )
  }),
  graphql.mutation("insertUser", (_req, res, ctx) => {
    insertUserCalled = true
    return res(
      ctx.data({
        insert_users_one: {
          id: "fake id",
        },
      })
    )
  }),
  graphql.mutation("updateService", (_req, res, ctx) => {
    updateServiceCalled = true
    return res(
      ctx.data({
        update_services_by_pk: {
          id: "fake id",
        },
      })
    )
  }),
  graphql.mutation("deleteServices", (_req, res, ctx) => {
    return res(
      ctx.data({
        delete_services: {
          returning: [
            { users: { services_aggregate: { aggregate: { count: 0 } } } },
          ],
        },
      })
    )
  }),
  graphql.mutation("deleteUsers", (_req, res, ctx) => {
    return res(
      ctx.data({
        delete_users: {
          affected_rows: 0,
        },
      })
    )
  }),
  graphql.query("getServicesMatchingId", (_req, res, ctx) => {
    return res(
      ctx.data({
        services: [],
      })
    )
  })
)

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" })
})

afterAll(() => {
  server.close()
})

beforeEach(() => {
  insertAccountCalled = false
  insertUserCalled = false
  updateServiceCalled = false
  jest.resetModules()
  for (const serviceFetcher of Object.values(servicesFetchers)) {
    serviceFetcher.mockImplementation(() => [])
  }
  server.resetHandlers()
})

jest.mock("@/services/fetchers/github")
jest.mock("@/services/fetchers/matomo")
jest.mock("@/services/fetchers/mattermost")
jest.mock("@/services/fetchers/nextcloud")
jest.mock("@/services/fetchers/ovh")
jest.mock("@/services/fetchers/sentry")
jest.mock("@/services/fetchers/zammad")

it("should call every fetcher", async () => {
  await sync(SERVICES)
  for (const serviceFetcher of Object.values(servicesFetchers)) {
    expect(serviceFetcher).toHaveBeenCalledTimes(1)
  }
  expect(insertAccountCalled).toBe(false)
  expect(insertUserCalled).toBe(false)
  expect(updateServiceCalled).toBe(false)
})

it("should insert the account and a new user", async () => {
  fetchGithubUsers.mockImplementation(() => [{ id: "fake id" }])
  await sync(SERVICES)
  expect(insertAccountCalled).toBe(true)
  expect(insertUserCalled).toBe(true)
  expect(updateServiceCalled).toBe(false)
})

it("should update the account", async () => {
  fetchGithubUsers.mockImplementation(() => [{ id: "fake id" }])
  server.use(
    graphql.query("getServicesMatchingId", (_req, res, ctx) => {
      return res(
        ctx.data({
          services: [{ id: 0 }],
        })
      )
    })
  )
  await sync(SERVICES)
  expect(insertAccountCalled).toBe(false)
  expect(insertUserCalled).toBe(false)
  expect(updateServiceCalled).toBe(true)
})

it("should do nothing and return an empty string on inconsistent DB", async () => {
  fetchGithubUsers.mockImplementation(() => [{ id: "fake id" }])
  server.use(
    graphql.query("getServicesMatchingId", (_req, res, ctx) => {
      return res(
        ctx.data({
          services: [{ id: "fake id" }, { id: "fake id" }],
        })
      )
    })
  )
  await sync(SERVICES)
  expect(insertAccountCalled).toBe(false)
  expect(insertUserCalled).toBe(false)
  expect(updateServiceCalled).toBe(false)
})
