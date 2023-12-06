import { render } from "@testing-library/react"

import Loader from "../../../src/components/common/loader"

import { it, expect } from "vitest"

it("renders small loader", () => {
  const { container } = render(<Loader size="sm" />)
  expect(container).toMatchSnapshot()
})

it("renders medium loader", () => {
  const { container } = render(<Loader />)
  expect(container).toMatchSnapshot()
})

it("renders large loader", () => {
  const { container } = render(<Loader size="large" />)
  expect(container).toMatchSnapshot()
})
