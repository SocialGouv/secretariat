import { render } from "@testing-library/react"

import Alert from "../../../src/components/common/alert"

it("renders warning alert", () => {
  const { container } = render(
    <Alert message="This is a warning alert." type="warning" />
  )
  expect(container).toMatchSnapshot()
})

it("renders info alert", () => {
  const { container } = render(
    <Alert message="This is a info alert." type="info" />
  )
  expect(container).toMatchSnapshot()
})

it("renders success alert", () => {
  const { container } = render(
    <Alert message="This is a success alert." type="success" />
  )
  expect(container).toMatchSnapshot()
})

it("renders error alert", () => {
  const { container } = render(
    <Alert message="This is a error alert." type="error" />
  )
  expect(container).toMatchSnapshot()
})
