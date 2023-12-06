import { render } from "@testing-library/react"

import ServiceLogo from "../../../src/components/common/service-logo"

import { it, expect } from "vitest"

it("renders small service logo", () => {
  const { container } = render(<ServiceLogo size="sm" name="matomo" />)
  expect(container).toMatchSnapshot()
})

it("renders medium service logo", () => {
  const { container } = render(<ServiceLogo name="matomo" />)
  expect(container).toMatchSnapshot()
})

it("renders large service logo", () => {
  const { container } = render(<ServiceLogo size="lg" name="matomo" />)
  expect(container).toMatchSnapshot()
})
