import { render } from "@testing-library/react"
import { vi, it, expect } from "vitest"

import Index from "@/pages/index"

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: null,
    status: "unauthenticated",
  }),
}))

it("renders home page", () => {
  const { container } = render(<Index />)
  expect(container).toMatchSnapshot()
})
