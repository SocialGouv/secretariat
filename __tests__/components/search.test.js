import { render } from "@testing-library/react"

import Search from "../../src/components/search"

it("renders homepage", () => {
  const { container } = render(<Search />)
  expect(container).toMatchSnapshot()
})
