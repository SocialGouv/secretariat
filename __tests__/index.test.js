import { render } from "@testing-library/react"
import { useSession } from "next-auth/react"

import Index from "../src/pages/index"
import { session } from "../src/mocks/data"

describe("when index page renders", () => {
  it("displays a loader if session is undefined", () => {
    useSession.mockImplementation(() => [false, false])
    const { container } = render(<Index />)
    expect(container).toMatchSnapshot()
  })

  it("displays login form if session is null", () => {
    useSession.mockImplementation(() => ({
      data: null,
      status: "unauthenticated",
    }))
    const { container } = render(<Index />)
    expect(container).toMatchSnapshot()
  })

  it("displays users list if session is valid", () => {
    useSession.mockImplementation(() => ({
      data: session,
      status: "authenticated",
    }))
    const { container } = render(<Index />)
    expect(container).toMatchSnapshot()
  })
})
