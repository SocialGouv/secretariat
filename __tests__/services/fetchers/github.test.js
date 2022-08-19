import graphQLFetcher from "@/utils/graphql-fetcher"
import { fetchGithubUsers } from "@/services/fetchers/github"

jest.mock("@/utils/graphql-fetcher")
jest.mock("@/utils/jwt", () => ({
  getJwt: () => "",
}))

it("should return a list of fetched users", async () => {
  graphQLFetcher
    .mockResolvedValueOnce(
      Promise.resolve({
        organization: {
          membersWithRole: {
            nodes: [{}, {}, {}],
            pageInfo: { hasNextPage: true, endCursor: "cursor" },
          },
        },
      })
    )
    .mockResolvedValueOnce(
      Promise.resolve({
        organization: {
          membersWithRole: {
            nodes: [],
            pageInfo: { hasNextPage: false, endCursor: "" },
          },
        },
      })
    )
    .mockResolvedValue(
      Promise.resolve({
        organization: {
          teams: { nodes: ["", ""] },
        },
      })
    )

  const result = await fetchGithubUsers()
  expect(result).toStrictEqual([
    { teams: ["", ""] },
    { teams: ["", ""] },
    { teams: ["", ""] },
  ])
})
