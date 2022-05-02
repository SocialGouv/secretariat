import fetchAndUpdateServices from "@/services/fetch"
import { fetchGithubUsers } from "@/services/fetchers/github"
import { fetchMatomoUsers } from "@/services/fetchers/matomo"
import { fetchMattermostUsers } from "@/services/fetchers/mattermost"
import { fetchNextcloudUsers } from "@/services/fetchers/nextcloud"
import { fetchOvhUsers } from "@/services/fetchers/ovh"
import { fetchSentryUsers } from "@/services/fetchers/sentry"
import { fetchZammadUsers } from "@/services/fetchers/zammad"

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
jest.mock("@/utils/fetcher", () =>
  jest.fn().mockImplementation(() =>
    Promise.resolve({
      delete_services: { returning: [] },
      delete_users: { affected_rows: [] },
    })
  )
)

jest.mock("@/services/fetchers/github", () => ({
  fetchGithubUsers: jest.fn(() => []),
}))
jest.mock("@/services/fetchers/matomo", () => ({
  fetchMatomoUsers: jest.fn(() => []),
}))
jest.mock("@/services/fetchers/mattermost", () => ({
  fetchMattermostUsers: jest.fn(() => []),
}))
jest.mock("@/services/fetchers/nextcloud", () => ({
  fetchNextcloudUsers: jest.fn(() => []),
}))
jest.mock("@/services/fetchers/ovh", () => ({
  fetchOvhUsers: jest.fn(() => []),
}))
jest.mock("@/services/fetchers/sentry", () => ({
  fetchSentryUsers: jest.fn(() => []),
}))
jest.mock("@/services/fetchers/zammad", () => ({
  fetchZammadUsers: jest.fn(() => []),
}))

it("should call every fetcher", async () => {
  await fetchAndUpdateServices("jwt")
  for (const serviceFetcher of Object.values(servicesFetchers)) {
    expect(serviceFetcher).toHaveBeenCalled()
  }
})
