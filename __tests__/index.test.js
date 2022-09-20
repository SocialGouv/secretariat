import { render } from "@testing-library/react"
import { useSession } from "next-auth/react"

import Index from "../src/pages/index"

it("renders home page", () => {
  useSession.mockImplementation(() => ({
    data: null,
    status: "unauthenticated",
  }))
  const { container } = render(<Index />)
  expect(container).toMatchSnapshot()
})
