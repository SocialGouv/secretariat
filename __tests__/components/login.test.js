import { render } from "@testing-library/react"

import Login from "../../src/components/login"

it("renders homepage", () => {
  const { container } = render(<Login />)
  expect(container).toMatchSnapshot()
})
