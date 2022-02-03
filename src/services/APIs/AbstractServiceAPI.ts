import fetcher from "@/utils/fetcher"
import { request, gql } from "graphql-request"

abstract class AbstractServiceAPI {
  abstract readonly service_name: string

  abstract fetch_data(): Promise<object>

  constructor(required_env_vars: string[] = []) {
    required_env_vars.forEach((env) => {
      if (!process.env[env]) {
        throw ReferenceError(`Could not find ${env} environment variable`)
      }
    })
  }

  format_data(data: object): object {
    return data
  }

  async fetch_data_and_update_database(jwt: string) {
    const data = this.format_data(await this.fetch_data())

    if (!process.env.NEXT_PUBLIC_HASURA_URL) {
      throw ReferenceError(
        "Could not find NEXT_PUBLIC_HASURA_URL environment variable"
      )
    }
    fetcher(
      gql`
    mutation UpdateData($data: jsonb!) {
      update_services(where: {}, _set: { ${this.service_name}: $data }) {
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
}

export default AbstractServiceAPI
