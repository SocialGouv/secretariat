import { fetchGithubUsers } from "@/services/fetchers/github"
import fetcher from "@/utils/fetcher"
import { gql } from "graphql-request"
import { fetchMatomoUsers } from "./fetchers/matomo"
import { fetchMattermostUsers } from "./fetchers/mattermost"
import { fetchNextcloudUsers } from "./fetchers/nextcloud"
import { fetchOvhUsers } from "./fetchers/ovh"
import { fetchZammadUsers } from "./fetchers/zammad"
import { fetchSentryUsers } from "./fetchers/sentry"

export const DEFAULT_DELAY = 100

const SERVICES = [
  "github",
  "matomo",
  "mattermost",
  "nextcloud",
  "ovh",
  "sentry",
  "zammad",
] as const

const servicesFetchers = {
  github: fetchGithubUsers,
  matomo: fetchMatomoUsers,
  mattermost: fetchMattermostUsers,
  nextcloud: fetchNextcloudUsers,
  ovh: fetchOvhUsers,
  sentry: fetchSentryUsers,
  zammad: fetchZammadUsers,
}

export type FetchedData = Record<string, unknown> | Record<string, unknown>[]

const updateDbWithData = (
  serviceName: string,
  data: FetchedData,
  jwt: string
) => {
  fetcher(
    gql`
      mutation UpdateData($data: jsonb!) {
        update_services(where: {}, _set: { ${serviceName}: $data }) {
          returning {
            id
          }
        }
      }
`,
    jwt,
    { data }
  )
}

export const fetchAndUpdateServices = async (jwt: string) => {
  SERVICES.forEach(async (serviceName) => {
    const data = await servicesFetchers[serviceName]()
    updateDbWithData(serviceName, data, jwt)
  })
}
