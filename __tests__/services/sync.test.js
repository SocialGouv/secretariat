import { sync } from "@/services/sync"
import SERVICES from "@/utils/SERVICES"
import { fetchGithubUsers } from "@/services/fetchers/github"
import { fetchMatomoUsers } from "@/services/fetchers/matomo"
import { fetchMattermostUsers } from "@/services/fetchers/mattermost"
import { fetchNextcloudUsers } from "@/services/fetchers/nextcloud"
import { fetchOvhUsers } from "@/services/fetchers/ovh"
import { fetchSentryUsers } from "@/services/fetchers/sentry"
import { fetchZammadUsers } from "@/services/fetchers/zammad"
import { graphql, HttpResponse } from "msw"
import { server } from "@/mocks/server"
import { vi, expect, it, beforeEach } from "vitest"

const servicesFetchers = {
  github: fetchGithubUsers,
  matomo: fetchMatomoUsers,
  mattermost: fetchMattermostUsers,
  nextcloud: fetchNextcloudUsers,
  ovh: fetchOvhUsers,
  sentry: fetchSentryUsers,
  zammad: fetchZammadUsers,
}

vi.mock("@/utils/jwt", () => ({
  getJwt: () => "",
}))

beforeEach(() => {
  vi.clearAllMocks()
})

vi.mock("@/services/fetchers/github", () => ({
  fetchGithubUsers: vi.fn().mockReturnValue([{ id: "fake id" }]),
}))
vi.mock("@/services/fetchers/matomo")
vi.mock("@/services/fetchers/mattermost")
vi.mock("@/services/fetchers/nextcloud")
vi.mock("@/services/fetchers/ovh")
vi.mock("@/services/fetchers/sentry")
vi.mock("@/services/fetchers/zammad")

it("should call every fetcher", async () => {
  const results = await sync(SERVICES)
  for (const serviceFetcher of Object.values(servicesFetchers)) {
    expect(serviceFetcher).toHaveBeenCalledTimes(1)
  }
  expect(results).toStrictEqual({
    accountDeletions: 0,
    errors: 0,
    insertions: 1,
    updates: 0,
    userDeletions: 0,
    enablements: 0,
  })
})

it("should insert the account and a new user", async () => {
  const results = await sync(SERVICES)
  expect(results).toStrictEqual({
    accountDeletions: 0,
    errors: 0,
    insertions: 1,
    updates: 0,
    userDeletions: 0,
    enablements: 0,
  })
})

it("should update the account", async () => {
  server.use(
    graphql.query("getServicesMatchingId", () =>
      HttpResponse.json({
        data: {
          services: [{ id: 0 }],
        },
      })
    )
  )
  const results = await sync(SERVICES)
  expect(results).toStrictEqual({
    accountDeletions: 0,
    errors: 0,
    insertions: 0,
    updates: 1,
    userDeletions: 0,
    enablements: 0,
  })
})

it("should do nothing and return an empty string on inconsistent DB", async () => {
  server.use(
    graphql.query("getServicesMatchingId", () =>
      HttpResponse.json({
        data: {
          // Two entries with the same ID
          services: [{ id: "fake id" }, { id: "fake id" }],
        },
      })
    )
  )
  const results = await sync(SERVICES)
  expect(results).toStrictEqual({
    accountDeletions: 0,
    errors: 1,
    insertions: 0,
    updates: 0,
    userDeletions: 0,
    enablements: 0,
  })
})
