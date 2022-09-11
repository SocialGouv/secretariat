import { render } from "@testing-library/react"
import { useRouter } from "next/router"

import Onboarding from "../src/pages/onboarding"

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/onboarding",
      pathname: "",
      query: "",
      asPath: "",
    }
  },
}))

it("renders onboarding page", () => {
  const { container } = render(<Onboarding />)
  expect(container).toMatchSnapshot()
})
