import { useSession } from "next-auth/react"
import { render } from "@testing-library/react"

import Header from "../../src/components/header"

// https://github.com/nextauthjs/next-auth/issues/775
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

it("renders header", () => {
  useSession.mockReturnValueOnce([false, false])
  const { container } = render(<Header />)
  expect(container).toMatchSnapshot()
})
