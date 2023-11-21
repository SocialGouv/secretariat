import { render } from "@testing-library/react"
import Accounts from "../src/pages/accounts"
import { vi, it, expect } from "vitest"
import { session } from "../src/mocks/data"

const useSession = vi.hoisted(() => vi.fn())
vi.mock("next-auth/react", () => ({ useSession }))

it("displays login form if session is invalid", () => {
  useSession.mockReturnValue({ data: null, status: "unauthenticated" })
  const { container } = render(<Accounts />)
  expect(container).toMatchSnapshot()
})

it("displays users list if session is valid", () => {
  useSession.mockReturnValue({ data: session, status: "authenticated" })
  const { container } = render(<Accounts />)
  expect(container).toMatchSnapshot()
})
