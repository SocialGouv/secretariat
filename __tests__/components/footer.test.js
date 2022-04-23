import { render } from "@testing-library/react"

import Footer from "../../src/components/footer"

it("renders footer", () => {
  const { container } = render(<Footer />)
  expect(container).toMatchSnapshot()
})
