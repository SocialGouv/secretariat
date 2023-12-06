import { render } from "@testing-library/react"

import Layout from "../../src/components/layout"

import { vi, it, expect } from "vitest"

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: null,
    status: "unauthenticated",
  }),
}))

it("renders layout", () => {
  const { container } = render(
    <Layout>
      <div>some children here</div>
    </Layout>
  )

  expect(container).toMatchSnapshot()
})
