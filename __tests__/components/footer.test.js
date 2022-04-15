import { render } from "@testing-library/react"

import Footer from "../../src/components/footer"

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

process.env.NEXT_PUBLIC_APP_VERSION = "0.0.42"
process.env.NEXT_PUBLIC_APP_VERSION_COMMIT =
  "2f7c23024eeb820ed67aef00bc40e7955111cbf4"
process.env.NEXT_PUBLIC_APP_REPOSITORY_URL =
  "https://github.com/SocialGouv/secretariat"

it("renders footer", () => {
  const { container } = render(<Footer />)
  expect(container).toMatchSnapshot()
})
