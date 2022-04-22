import { SWRConfig } from "swr"
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react"

import Users from "../../src/components/users"

describe("when fetching data", () => {
  const fetcher = (url) => fetch(url).then((r) => r.json())

  it("should use the mocked server endpoints", async () => {
    const data = await fetcher("http://localhost/test")
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toBe("test result")
  })
})

describe("when users are loaded", () => {
  let container

  beforeEach(async () => {
    const rendered = render(
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        <Users />
      </SWRConfig>
    )
    container = rendered.container
    await waitForElementToBeRemoved(
      await screen.getByText("Aucun utilisateur sélectionné."),
      { timeout: 10000 }
    )
  })

  it("matches the snapshot", () => {
    expect(container).toMatchSnapshot()
  })
})
