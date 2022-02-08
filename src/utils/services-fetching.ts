import * as dataFetchers from "@/services/data-fetchers"
import fetcher from "@/utils/fetcher"
import { gql } from "graphql-request"

export const SERVICES = [
  "github",
  "matomo",
  "mattermost",
  "nextcloud",
  "ovh",
  "sentry",
  "zammad",
] as const

export type FetchedData = Record<string, unknown> | Record<string, unknown>[]

// Each service fetcher requires some credentials or a token to work
export const checkEnv = (envVars: string[]) => {
  envVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw ReferenceError(`Could not find ${envVar} environment variable`)
    }
  })
}

export const updateDbWithData = (
  serviceName: string,
  data: FetchedData,
  jwt: string
) => {
  checkEnv(["NEXT_PUBLIC_HASURA_URL"])

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

export const fetchAndUpdateServices = (jwt: string) => {
  SERVICES.forEach(async (serviceName) => {
    const data = await dataFetchers[serviceName]()
    updateDbWithData(serviceName, data, jwt)
  })
}
