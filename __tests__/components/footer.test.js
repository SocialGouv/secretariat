import { render } from "@testing-library/react"

import Footer from "../../src/components/footer"

process.env.NEXT_PUBLIC_APP_VERSION = "0.0.42"
process.env.NEXT_PUBLIC_APP_VERSION_COMMIT =
  "2f7c23024eeb820ed67aef00bc40e7955111cbf4"
process.env.NEXT_PUBLIC_APP_REPOSITORY_URL =
  "https://github.com/SocialGouv/secretariat"

it("renders homepage", () => {
  const { container } = render(<Footer />)
  expect(container).toMatchSnapshot()
})
