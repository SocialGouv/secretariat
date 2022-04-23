import { render } from "@testing-library/react"
import { useSession } from "next-auth/react"

import Layout from "../../src/components/layout"

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}))

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

it("renders layout", () => {
  useSession.mockReturnValueOnce([false, false])

  const { container } = render(
    <Layout>
      <div>some children here</div>
    </Layout>
  )

  expect(container).toMatchSnapshot()
})
