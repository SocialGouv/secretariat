import { render } from "@testing-library/react"

import Search from "../../src/components/search"

import { it, expect } from "vitest"

it("renders search", () => {
  const { container } = render(<Search />)
  expect(container).toMatchSnapshot()
})
