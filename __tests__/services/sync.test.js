import { sync } from "@/services/sync"
import SERVICES from "@/utils/SERVICES"
import { fetchGithubUsers } from "@/services/fetchers/github"
import { fetchMatomoUsers } from "@/services/fetchers/matomo"
import { fetchMattermostUsers } from "@/services/fetchers/mattermost"
import { fetchNextcloudUsers } from "@/services/fetchers/nextcloud"
import { fetchOvhUsers } from "@/services/fetchers/ovh"
import { fetchSentryUsers } from "@/services/fetchers/sentry"
import { fetchZammadUsers } from "@/services/fetchers/zammad"
import { graphql } from "msw"
import { server } from "@/mocks/server"

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

beforeEach(() => {
  jest.resetModules()
  for (const serviceFetcher of Object.values(servicesFetchers)) {
    serviceFetcher.mockImplementation(() => [])
  }
})

jest.mock("@/services/fetchers/github")
jest.mock("@/services/fetchers/matomo")
jest.mock("@/services/fetchers/mattermost")
jest.mock("@/services/fetchers/nextcloud")
jest.mock("@/services/fetchers/ovh")
jest.mock("@/services/fetchers/sentry")
jest.mock("@/services/fetchers/zammad")

it("should call every fetcher", async () => {
  const results = await sync(SERVICES)
  for (const serviceFetcher of Object.values(servicesFetchers)) {
    expect(serviceFetcher).toHaveBeenCalledTimes(1)
  }
  expect(results).toStrictEqual({
    accountDeletions: 0,
    errors: 0,
    insertions: 0,
    updates: 0,
    userDeletions: 0,
  })
})

it("should insert the account and a new user", async () => {
  fetchGithubUsers.mockImplementation(() => [{ id: "fake id" }])
  const results = await sync(SERVICES)
  expect(results).toStrictEqual({
    accountDeletions: 0,
    errors: 0,
    insertions: 1,
    updates: 0,
    userDeletions: 0,
  })
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
  const results = await sync(SERVICES)
  expect(results).toStrictEqual({
    accountDeletions: 0,
    errors: 0,
    insertions: 0,
    updates: 1,
    userDeletions: 0,
  })
})

it("should do nothing and return an empty string on inconsistent DB", async () => {
  fetchGithubUsers.mockImplementation(() => [{ id: "fake id" }])
  server.use(
    graphql.query("getServicesMatchingId", (_req, res, ctx) => {
      return res(
        ctx.data({
          // Two entries with the same ID
          services: [{ id: "fake id" }, { id: "fake id" }],
        })
      )
    })
  )
  const results = await sync(SERVICES)
  expect(results).toStrictEqual({
    accountDeletions: 0,
    errors: 1,
    insertions: 0,
    updates: 0,
    userDeletions: 0,
  })
})
