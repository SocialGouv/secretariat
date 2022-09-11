import { render } from "@testing-library/react"

import Index from "../src/pages/index"

it("renders home page", () => {
  const { container } = render(<Index />)
  expect(container).toMatchSnapshot()
})
