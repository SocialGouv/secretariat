import { render } from "@testing-library/react"

import SiteLogo from "../../../src/components/common/site-logo"

import { it, expect } from "vitest"

it("renders regular site logo", () => {
  const { container } = render(<SiteLogo />)
  expect(container).toMatchSnapshot()
})

it("renders big site logo", () => {
  const { container } = render(<SiteLogo big={true} />)
  expect(container).toMatchSnapshot()
})
