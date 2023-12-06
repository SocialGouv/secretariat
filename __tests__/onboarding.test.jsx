import { render } from "@testing-library/react"
import { vi, beforeAll, afterAll, it, expect } from "vitest"
import Onboarding from "@/pages/onboarding"

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: null,
    status: "unauthenticated",
  }),
}))

vi.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/onboarding",
      pathname: "",
      query: "",
      asPath: "",
    }
  },
}))

beforeAll(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date("20 Aug 2020 00:12:00 GMT").getTime())
})

afterAll(() => {
  vi.useRealTimers()
})

it("renders onboarding page", () => {
  // Import has to happen after the jest setup that mocks the Date object
  const { container } = render(<Onboarding />)
  expect(container).toMatchSnapshot()
})
