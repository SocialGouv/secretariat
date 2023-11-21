import graphQLFetcher from "@/utils/graphql-fetcher"
import { fetchGithubUsers } from "@/services/fetchers/github"
import { vi, it, expect } from "vitest"

vi.mock("@/utils/graphql-fetcher")
vi.mock("@/utils/jwt", () => ({
  getJwt: () => "",
}))

it("should return a list of fetched users", async () => {
  graphQLFetcher
    .mockResolvedValueOnce(
      Promise.resolve({
        organization: {
          membersWithRole: {
            nodes: [{}, {}, {}],
            edges: [{}, {}, {}],
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
            edges: [],
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
