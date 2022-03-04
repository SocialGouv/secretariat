import { useSession } from "next-auth/react"
import { render } from "@testing-library/react"

import Users from "../../src/components/users"

// https://github.com/nextauthjs/next-auth/issues/775
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}))

const users = [
  { id: 1, name: "user1", email: "user1@paradise.sky" },
  { id: 2, name: "user2", email: "user1@paradise.sky" },
]

it("renders users", () => {
  useSession.mockReturnValueOnce([false, false])
  const { container } = render(<Users users={users} />)
  expect(container).toMatchSnapshot()
})
