import { render } from "@testing-library/react"

import Badge from "../../../src/components/common/badge"

it("renders expiry badge", () => {
  const { container } = render(
    <Badge type="expiry" label="expiry" title="expiry" />
  )
  expect(container).toMatchSnapshot()
})

it("renders warning badge", () => {
  const { container } = render(
    <Badge type="warning" label="warning" title="warning" />
  )
  expect(container).toMatchSnapshot()
})

it("renders disabled badge", () => {
  const { container } = render(
    <Badge type="disabled" label="disabled" title="disabled" />
  )
  expect(container).toMatchSnapshot()
})

it("renders icon warning badge", () => {
  const { container } = render(<Badge type="warning" title="icon badge" />)
  expect(container).toMatchSnapshot()
})
