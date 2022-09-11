import { render } from "@testing-library/react"
import { useSession } from "next-auth/react"

import Accounts from "../src/pages/accounts"
import { session } from "../src/mocks/data"

describe("when accounts page renders", () => {
  it("displays login form if session is invalid", () => {
    useSession.mockImplementation(() => ({
      data: null,
      status: "unauthenticated",
    }))
    const { container } = render(<Accounts />)
    expect(container).toMatchSnapshot()
  })

  it("displays users list if session is valid", () => {
    useSession.mockImplementation(() => ({
      data: session,
      status: "authenticated",
    }))
    const { container } = render(<Accounts />)
    expect(container).toMatchSnapshot()
  })
})
