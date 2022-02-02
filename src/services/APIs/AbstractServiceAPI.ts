import { request, gql } from "graphql-request"

abstract class AbstractServiceAPI {
  abstract readonly serviceName: String

  abstract fetchData(): Promise<object>

  formatData(data: object): object {
    return data
  }

  async fetchDataAndUpdateDatabase(jwt: string) {
    const data = this.formatData(await this.fetchData())

    if (!process.env.NEXT_PUBLIC_HASURA_URL) {
      throw ReferenceError(
        "Could not find NEXT_PUBLIC_HASURA_URL environment variable"
      )
    }
    request(
      process.env.NEXT_PUBLIC_HASURA_URL,
      gql`
        mutation UpdateData($data: jsonb!) {
          update_services(where: {}, _set: { ${this.serviceName}: $data }) {
            returning {
              id
            }
          }
        }
      `,
      { data },
      {
        Authorization: `Bearer ${jwt}`,
      }
    )
  }
}

export default AbstractServiceAPI
