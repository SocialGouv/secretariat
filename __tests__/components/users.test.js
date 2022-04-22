import { SWRConfig } from "swr"
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react"

import Users from "../../src/components/users"

describe("when users are loaded", () => {
  let container

  beforeEach(async () => {
    const rendered = render(
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        <Users />
      </SWRConfig>
    )
    container = rendered.container
    await waitForElementToBeRemoved(() =>
      screen.getByText("Aucun utilisateur sélectionné.")
    )
  })

  it("matches the snapshot", () => {
    expect(container).toMatchSnapshot()
  })
})
