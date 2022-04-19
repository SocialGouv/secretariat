import { useSession } from "next-auth/react"
import { render } from "@testing-library/react"

import Header from "../../src/components/header"

// https://github.com/nextauthjs/next-auth/issues/775
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}))

it("renders header", () => {
  useSession.mockReturnValueOnce([false, false])
  const { container } = render(<Header />)
  expect(container).toMatchSnapshot()
})
