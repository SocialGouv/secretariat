import { render } from "@testing-library/react"

import { session } from "../../src/mocks/data"
import Header from "../../src/components/header"

import { describe, it, expect, vi } from "vitest"

const useSession = vi.hoisted(() => vi.fn())
vi.mock("next-auth/react", () => ({ useSession }))

vi.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/accounts",
      pathname: "",
      query: "",
      asPath: "",
    }
  },
}))

describe("when header renders", () => {
  it("does not show authenticated user if session is not valid", () => {
    useSession.mockImplementation(() => [false, false])
    const { container } = render(<Header />)
    expect(container).toMatchSnapshot()
  })

  it("does show authenticated user if session is valid", () => {
    useSession.mockImplementation(() => ({
      data: session,
      status: "authenticated",
    }))
    const { container } = render(<Header />)
    expect(container).toMatchSnapshot()
  })
})
