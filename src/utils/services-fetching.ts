import * as data_fetchers from "@/services/data-fetchers"
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

export const checkEnv = (env_vars: string[]) => {
  env_vars.forEach((env_var) => {
    if (!process.env[env_var]) {
      throw ReferenceError(`Could not find ${env_var} environment variable`)
    }
  })
}

export const updateDbWithData = (
  service_name: string,
  data: FetchedData,
  jwt: string
) => {
  checkEnv(["NEXT_PUBLIC_HASURA_URL"])

  fetcher(
    gql`
      mutation UpdateData($data: jsonb!) {
        update_services(where: {}, _set: { ${service_name}: $data }) {
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
  SERVICES.forEach(async (service_name) => {
    const data = await data_fetchers[service_name]()
    updateDbWithData(service_name, data, jwt)
  })
}
