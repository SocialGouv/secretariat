import * as data_fetchers from "@/services/data_fetchers"
import fetcher from "@/utils/fetcher"
import { gql } from "graphql-request"

export const SERVICES = [
  "github",
  "matomo",
  "nextcloud",
  "ovh",
  "sentry",
  "zammad",
] as const

export type FetchedData = Record<string, unknown> | Record<string, unknown>[]

export const check_env = (env_vars: string[]) => {
  env_vars.forEach((env_var) => {
    if (!process.env[env_var]) {
      throw ReferenceError(`Could not find ${env_var} environment variable`)
    }
  })
}

export const update_db_with_data = (
  service_name: string,
  data: FetchedData,
  jwt: string
) => {
  check_env(["NEXT_PUBLIC_HASURA_URL"])

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

export const fetch_and_update_services = (jwt: string) => {
  SERVICES.forEach(async (service_name) => {
    const data = await data_fetchers[service_name]()
    update_db_with_data(service_name, data, jwt)
  })
}
