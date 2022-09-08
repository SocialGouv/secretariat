import graphQLFetcher from "@/utils/graphql-fetcher"
import logAction from "@/utils/log-action"
import { insertLog } from "@/queries/index"

jest.mock("@/utils/graphql-fetcher", () => jest.fn())

it("should call fetcher with cookie and no custom token", () => {
  logAction({ action: "testAction" })
  expect(graphQLFetcher).toHaveBeenLastCalledWith({
    query: insertLog,
    includeCookie: true,
    parameters: { action: "testAction" },
  })
})

it("should call fetcher with custom token and no cookie", () => {
  logAction({ action: "testAction", token: "testToken" })
  expect(graphQLFetcher).toHaveBeenLastCalledWith({
    query: insertLog,
    includeCookie: false,
    token: "testToken",
    parameters: { action: "testAction" },
  })
})

it("should call fetcher with action parameter only", () => {
  logAction({ action: "testAction" })
  expect(graphQLFetcher).toHaveBeenLastCalledWith({
    query: insertLog,
    includeCookie: true,
    parameters: { action: "testAction" },
  })
})

it("should call fetcher with action and user parameters", () => {
  logAction({ action: "testAction", user: "testUser" })
  expect(graphQLFetcher).toHaveBeenLastCalledWith({
    query: insertLog,
    includeCookie: true,
    parameters: { action: "testAction", user: "testUser" },
  })
})
