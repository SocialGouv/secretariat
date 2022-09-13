import { render } from "@testing-library/react"
import { useSession } from "next-auth/react"

import Layout from "../../src/components/layout"

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}))

it("renders layout", () => {
  useSession.mockImplementation(() => ({
    data: null,
    status: "unauthenticated",
  }))
  const { container } = render(
    <Layout>
      <div>some children here</div>
    </Layout>
  )

  expect(container).toMatchSnapshot()
})
