// __tests__/snapshot.js

import { render } from "@testing-library/react"
import Home from "../src/pages/index"
import { useSession } from "next-auth/react"

// https://github.com/nextauthjs/next-auth/issues/775
jest.mock("next-auth/react")

it("renders homepage", () => {
  useSession.mockReturnValueOnce([false, false])
  const { container } = render(<Home />)
  expect(container).toMatchSnapshot()
})
