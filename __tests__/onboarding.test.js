import { render } from "@testing-library/react"

jest.mock("next/router", () => ({
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
  jest.useFakeTimers()
  jest.setSystemTime(new Date("20 Aug 2020 00:12:00 GMT").getTime())
})

afterAll(() => {
  jest.useRealTimers()
})

it("renders onboarding page", () => {
  // Import has to happen after the jest setup that mocks the Date object
  const Onboarding = require("../src/pages/onboarding").default
  const { container } = render(<Onboarding />)
  expect(container).toMatchSnapshot()
})
