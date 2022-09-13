import { useSession } from "next-auth/react"
import { render } from "@testing-library/react"

import { session } from "../../src/mocks/data"
import Header from "../../src/components/header"

jest.mock("next/router", () => ({
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
