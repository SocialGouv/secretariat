import { useSession } from "next-auth/react"
import { render } from "@testing-library/react"

import Users from "../../src/components/users"

// https://github.com/nextauthjs/next-auth/issues/775
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}))

it("renders users", () => {
  useSession.mockReturnValueOnce([false, false])
  const { container } = render(<Users />)
  expect(container).toMatchSnapshot()
})
