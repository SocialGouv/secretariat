import { render } from "@testing-library/react"

import Menu from "../../src/components/menu"

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: "",
      asPath: "",
    }
  },
}))

it("renders homepage", () => {
  const { container } = render(<Menu />)
  expect(container).toMatchSnapshot()
})
