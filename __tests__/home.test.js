import { useSession } from "next-auth/react"
import { render } from "@testing-library/react"

import Home from "../src/pages/index"

// https://github.com/nextauthjs/next-auth/issues/775
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}))

it("renders homepage", () => {
  useSession.mockReturnValueOnce([false, false])
  const { container } = render(<Home />)
  expect(container).toMatchSnapshot()
})
